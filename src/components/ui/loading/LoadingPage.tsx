import { PropsWithChildren } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './styles/loadingPage.scss';

type Props = PropsWithChildren<unknown>;

const LoadingPage = (props: Props) => {
  const { children } = props;
  return (
    <div className="loading-page">
      <LoadingSpinner />
      <div>
        {children}
      </div>
    </div>
  );
};
export default LoadingPage;
