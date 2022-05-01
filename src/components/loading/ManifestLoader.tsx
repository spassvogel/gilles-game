import LoadingPage from 'components/ui/loading/LoadingPage';
import { sprites } from 'manifests/sprites';
import { PropsWithChildren, useEffect, useState } from 'react';
import { loadResourceAsync, loadResourcesAsync } from 'utils/pixiJs';


type Props = PropsWithChildren<unknown>;

const ManifestLoader = (props: Props) => {
  const { children } = props;
  const [loading, setLoading] = useState(true);
  // todo: load a bunch of stuff here

  useEffect(() => {
    const allSprites = Object.values(sprites);
    loadResourcesAsync(allSprites).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <LoadingPage>
        Loading sprites ...
      </LoadingPage>
    );
  }
  
  return (
    <>
     {children}
    </>
  );
};

export default ManifestLoader;