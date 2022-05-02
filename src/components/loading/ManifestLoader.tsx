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
    let counter = 0;
    Loader.shared.onProgress.add(() => {
      counter++;
      if (pctRef.current) {
        pctRef.current.innerHTML = `${((counter / allSprites.length) * 100).toFixed(0)}%`;
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