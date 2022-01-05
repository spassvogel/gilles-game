import { useEffect } from 'react';
import { useQuestLog } from 'hooks/store/useLog';

interface Props {
  questId: string;
}

const SceneLog = (props: Props) => {
  const log = useQuestLog(props.questId);
  useEffect(() => {
    const lastLog = log.shift();
    if ((lastLog?.time || 0) > Date.now() - 1000) {
      // console.log(lastLog?.key)
    }
  }, [log]);
  return null;
};

export default SceneLog;