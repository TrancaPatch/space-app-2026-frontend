import { useParams } from 'react-router-dom';
import { BodyModelViewer } from '../components/BodyModelViewer';
import '../styles/App.css';

export function BodyPage() {
  const { astronautId = '1' } = useParams<{ astronautId: string }>();

  return (
    <div className="body-page-wrapper">
      <BodyModelViewer astronautId={astronautId} />
    </div>
  );
}

export default BodyPage;