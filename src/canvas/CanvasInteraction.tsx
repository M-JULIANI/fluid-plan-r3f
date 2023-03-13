
import GuideCube, { GuideCubeProps } from '../components/GuideCube'

type AssociatedSpaceProps = {
    width: number,
    height: number
}

type CanvasInteractionProps = Partial<GuideCubeProps> & AssociatedSpaceProps;

const CanvasInteraction: React.FC = (props: CanvasInteractionProps) => {

    const { width, height, category, name } = props;
    return null;
}

export default CanvasInteraction;