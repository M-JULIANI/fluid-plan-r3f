
    var allCells = allPossibleCells.Select(x => new Vector2dInt((int) x.X, (int) x.Y));
    CalculateOverallGraph(allCells);

    var cluster1 = new sCluster(team1, b1);
    var cluster2 = new sCluster(team2, b2);
    var cluster3 = new sCluster(team3, b3);
    var cluster4 = new sCluster(team4, b4);

    var clusters = new List<sCluster>();
    clusters.Add(cluster1);
    clusters.Add(cluster2);
    clusters.Add(cluster3);
    clusters.Add(cluster4);
    List<double>[] arrayList = new List<double>[4];
    if(run)
    {
      var usedCells = new List<Vector2dInt>();
      int counter = 0;

      foreach(var c in clusters)
      {
        var doubles = c.ComputePositions(usedCells, counter);
        //RhinoApp.WriteLine(doubles.Count.ToString());
        var initialList = new List<double>();
        initialList.AddRange(doubles);
        arrayList[counter] = initialList;
        usedCells.AddRange(c._currentPts);
        counter++;
      }

    }

    _team1 = cluster1.GetFinalVectors();
    _team2 = cluster2.GetFinalVectors();
    _team3 = cluster3.GetFinalVectors();
    _team4 = cluster4.GetFinalVectors();

    c1 = arrayList[0];
    c2 = arrayList[1];
    c3 = arrayList[2];
    c4 = arrayList[3];
