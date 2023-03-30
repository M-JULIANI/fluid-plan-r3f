  public static Dictionary<Vector2dInt, SmartCell> _overallGraph;

  public static void CalculateOverallGraph(IEnumerable<Vector2dInt> allPts)
  {
    _overallGraph = new Dictionary<Vector2dInt, SmartCell>();

    foreach(var pt in allPts)
    {
      if(_overallGraph.ContainsKey(pt))
        continue;

      _overallGraph.Add(pt, new SmartCell(pt));
    }

  }

  class sCluster
  {
    public IEnumerable<Vector2dInt> _initialPts;
    public IEnumerable<Vector2dInt> _currentPts = null;

    public IEnumerable<Vector3d> GetFinalVectors()
    {
      return _currentPts.Select(x => new Vector3d(x.X, x.Y, 0));
    }
    public Curve _boundaryCrv;

    public Dictionary<Vector2dInt, SmartCell> localGraph;

    private bool _active = false;

    public bool Active
    {
      get
      {return _active;}
      set
      {
        if(value != _active)
        {
          _active = value;
          if(!_active)
            _currentPts = _initialPts;
        }
      }
    }

    public sCluster(List<Vector3d> pts, Curve boundaryCurve)
    {
      var vec2dInts = pts.Select(x => new Vector2dInt((int) x.X, (int) x.Y));
      _initialPts = vec2dInts;
      _currentPts = Enumerable.Empty<Vector2dInt>();
      _currentPts = _currentPts.Concat(_initialPts);
      _boundaryCrv = boundaryCurve;
      InitializeLocalGraph();
    }

    // public bool CheckIsOverlapped(List<Curve> otherCrvs)
    // {
    //   foreach(var other in otherCrvs)
    //   {
    //     var inter = Rhino.Geometry.Intersect.Intersection.CurveCurve(_boundaryCrv, other, 0.1, 0.01);
    //     if(inter != null)
    //     {
    //       Active = true;
    //       return true;
    //     }
    //   }
    //   Active = false;
    //   return false;
    // }

    public double GetNeighborConnectivity(int x, int y)
    {
      double total = 0.0;

      for (int i = -1; i <= 1; i++)
      {
        for (int j = -1; j <= 1; j++)
        {
          if( i == 0 && j == 0)
            continue;

          var neighborPos = new Vector2dInt(x + i, y + j);
          SmartCell neighbor;
          if(localGraph.TryGetValue(neighborPos, out neighbor))
          {
            if(neighbor.isActive)
            {
              var current = new Vector2dInt(x, y);
              var dist = current.DistanceTo(neighborPos);
              total += (1 / dist);
            }
          }
        }
      }
      return total;
    }

    private int GetNeighborCount(int x, int y)
    {
      int count = 0;

      for (int i = -1; i <= 1; i++)
      {
        for (int j = -1; j <= 1; j++)
        {
          if( i == 0 && j == 0)
            continue;

          var neighborPos = new Vector2dInt(x + i, y + j);
          SmartCell neighbor;
          if(localGraph.TryGetValue(neighborPos, out neighbor))
          {
            if(neighbor.isActive)
            {
              count++;
            }
          }
        }
      }
      // RhinoApp.WriteLine(count.ToString());
      return count;
    }

    public Dictionary<Vector2dInt, SmartCell> RecursiveExpand(Dictionary<Vector2dInt, SmartCell> locGraph, int numCells)
    {
      int relocated = 0;
      while(relocated < numCells)
      {
        var perim = GetPerimeterCells(localGraph).ToList();

        for (int i = 0; i < perim.Count; i++)
        {
          if(relocated == numCells)
            break;
          TryExpand(perim[i].Location, locGraph);

          relocated++;
        }
      }
      return locGraph;
    }
    public void TryExpand(Vector2dInt loc, Dictionary<Vector2dInt, SmartCell> locGraph)
    {
      int x = loc.X;
      int y = loc.Y;
      for (int i = -1; i <= 1; i++)
      {
        for (int j = -1; j <= 1; j++)
        {
          if( i == 0 && j == 0)
            continue;

          var neighborPos = new Vector2dInt(x + i, y + j);

          if(!localGraph.ContainsKey(neighborPos))
          {
            SmartCell possibleExpansionCell;
            if(_overallGraph.TryGetValue(neighborPos, out possibleExpansionCell))
            {
              if(!possibleExpansionCell.isActive)
              {
                UpdateGraphLocation(loc, neighborPos, locGraph);
              }
            }

            else
            {
              AddGraphLocation(loc, neighborPos, locGraph);
            }
          }
        }
      }
    }

    private IEnumerable<SmartCell> GetPerimeterCells(Dictionary<Vector2dInt, SmartCell> locGraph)
    {
      return locGraph
        .Where(x => GetNeighborCount(x.Key.X, x.Key.Y) <= 5)
        .Select(x => x.Value);
    }

    private void UpdateGraphLocation(Vector2dInt loc, Vector2dInt neighborPos,
      Dictionary<Vector2dInt, SmartCell> locGraph)
    {
      var smartCell = new SmartCell(neighborPos);
      smartCell.isActive = true;
      locGraph.Add(neighborPos, smartCell);
      _overallGraph[neighborPos] = smartCell;
    }
    private void AddGraphLocation(Vector2dInt loc, Vector2dInt neighborPos,
      Dictionary<Vector2dInt, SmartCell> locGraph)
    {
      var smartCell = new SmartCell(neighborPos);
      smartCell.isActive = true;
      locGraph.Add(neighborPos, smartCell);
      locGraph.Remove(loc);
      _overallGraph.Add(loc, smartCell);
    }

    public List<double> ComputePositions(List<Vector2dInt> prohibitedLocations, int listIndex)
    {
      var currentPts = _currentPts;
      List<double> conn = new List<double>();
      if(prohibitedLocations.Count() != 0 || listIndex == 0)
      {
        int objectsToRelocate = 0;

        var locsToRemove = new List<Vector2dInt>();
        foreach(var prob in prohibitedLocations)
        {
          var cell = _overallGraph[prob];
          cell.isActive = true;

          if(_currentPts.Contains(prob))
          {
            objectsToRelocate++;
            locsToRemove.Add(prob);
          }
        }

        //RhinoApp.WriteLine("Objects to relocate" + objectsToRelocate.ToString());

        foreach(var item in localGraph)
        {
          var connect = GetNeighborConnectivity(item.Key.X, item.Key.Y);
          var neighborCount = GetNeighborCount(item.Key.X, item.Key.Y);
          var cell = localGraph[item.Key];
          cell.Connectivity = connect;
          conn.Add(neighborCount);
        }

        var perimeterLocations = GetPerimeterCells(localGraph).ToList();

        if(locsToRemove.Count > perimeterLocations.Count)
        {
          localGraph = RecursiveExpand(localGraph, locsToRemove.Count);
          _currentPts = localGraph.Values.Where(x => x.isActive).Select(x => x.Location);
          return conn;
        }
        var orderedByConnectivity = perimeterLocations.OrderBy(x => x.Connectivity);
        var newExpansionPts = orderedByConnectivity
          .Take(objectsToRelocate)
          .ToList();

        for (int i = 0; i < locsToRemove.Count; i++)
        {
          localGraph.Remove(locsToRemove[i]);
          TryExpand(newExpansionPts[i].Location, localGraph);
        }

        _currentPts = localGraph.Values.Where(x => x.isActive).Select(x => x.Location);
      }

      return conn;


      //foreach
      //_overallGraph;
    }

    public void InitializeLocalGraph()
    {
      localGraph = new Dictionary<Vector2dInt, SmartCell>();
      foreach(var pt in _currentPts)
      {
        var smartCell = new SmartCell(pt);
        smartCell.isActive = true;
        localGraph.Add(pt, smartCell);
        if(!_overallGraph.ContainsKey(pt))
          _overallGraph.Add(pt, smartCell);
      }
    }
  }

  public class SmartCell
  {

    public double Connectivity;
    public Vector2dInt Location;
    public bool isActive { get; set; }

    public SmartCell(Vector2dInt loc)
    {
      Location = loc;
      isActive = false;
    }

  }
  public struct Vector2dInt: IEquatable<Vector2dInt>
  {
    private int _x { get; set; }
    public int X { get { return _x; }}
    private int _y { get; set; }
    public int Y { get { return _y; } }

    public Vector2dInt(int x, int y):this()
    {
      _x = x;
      _y = y;
    }

    public static Vector2dInt operator -(Vector2dInt vec1, Vector2dInt vec2)
    {
      Vector2dInt outVec = new Vector2dInt(vec1.X - vec2.X, vec1.Y - vec2.Y);
      return outVec;
    }

    public Vector2d ToVector2d()
    {
      Vector2d output = new Vector2d(X, Y);
      return output;
    }

    public double DistanceTo(Vector2dInt other)
    {
      return Math.Abs(_x - other.X) + Math.Abs(_y - other.Y);
    }

    public bool Equals(Vector2dInt other)
    {
      if (other == null)
        return false;

      if (X == other.X && Y == other.Y)
        return true;
      else
        return false;
    }

    public override bool Equals(Object obj)
    {
      if (obj == null)
        return false;

      if (obj.GetType().ToString() != "Vector2dInt")
        return false;
      else
        return Equals((Vector2dInt) obj);
    }

    public override int GetHashCode()
    {
      return Tuple.Create(_x, _y).GetHashCode();
    }

    public static bool operator ==(Vector2dInt vec1, Vector2dInt vec2)
    {
      if (((object) vec1) == null || ((object) vec2) == null)
        return Object.Equals(vec1, vec2);

      return vec1.Equals(vec2);
    }

    public static bool operator !=(Vector2dInt vec1, Vector2dInt vec2)
    {
      if (((object) vec1) == null || ((object) vec2) == null)
        return !Object.Equals(vec1, vec2);

      return !(vec1.Equals(vec2));
    }

  }