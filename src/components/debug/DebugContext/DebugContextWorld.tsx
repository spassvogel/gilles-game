import { useDispatch } from 'react-redux';
import './styles/debugContextTown.scss';
import { setSetting, SettingsKey } from 'store/actions/settings';
import { useSettings } from 'hooks/store/settings';

const DebugContextWorld = () => {
  const settings = useSettings();
  const dispatch = useDispatch();

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.currentTarget.getAttribute('setting-name');
    if (setting === null) throw new Error('No setting');
    dispatch(setSetting(setting as SettingsKey, e.currentTarget.checked));
  };

  return (
    <div className="debug-context-world">
      <h2>World map</h2>
      <section>
        <p>
          <label>Show grid</label>
          <input
            type="checkbox"
            checked={settings.debugMapShowGrid}
            setting-name="debugMapShowGrid"
            onChange={handleBooleanChange}
          />
        </p>
      </section>
      <h2>Scene</h2>
      <section>
        <p>
          <label>Show pathable tiles</label>
          <input
            type="checkbox"
            checked={settings.debugSceneShowPathable}
            setting-name="debugSceneShowPathable"
            onChange={handleBooleanChange}
          />
        </p>
      </section>
      <section>
        <p>
          <label>Show action queue tiles</label>
          <input
            type="checkbox"
            checked={settings.debugSceneShowActionQueue}
            setting-name="debugSceneShowActionQueue"
            onChange={handleBooleanChange}
          />
        </p>
      </section>
      <section>
        <p>
          <label>Show cell locations</label>
          <input
            type="checkbox"
            checked={settings.debugSceneShowCellLocations}
            setting-name="debugSceneShowCellLocations"
            onChange={handleBooleanChange}
          />
        </p>
      </section>
    </div>
  );
};

export default DebugContextWorld;
