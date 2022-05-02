import LoadingPage from 'components/ui/loading/LoadingPage';
import { sprites } from 'manifests/sprites';
import { Loader } from 'pixi.js';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { loadResourcesAsync } from 'utils/pixiJs';


type Props = PropsWithChildren<unknown>;

const ManifestLoader = (props: Props) => {
  const { children } = props;
  const [loading, setLoading] = useState(true);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const allSprites = Object.values(sprites);
    Loader.shared.onProgress.add(() => {
      if (pctRef.current) {
        pctRef.current.innerHTML = `${(Loader.shared.progress).toFixed(0)}%`;
      }
    });
    loadResourcesAsync(allSprites).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <LoadingPage>
        Loading sprites <span ref={pctRef}></span>...
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