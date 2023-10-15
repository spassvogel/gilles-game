import { useEffect, useState } from 'react'
import { Container } from '@pixi/react'
import FontFaceObserver from 'fontfaceobserver'
import StructureLabel from './StructureLabel'
import { type Structure } from 'definitions/structures'

type Props = {
  onStructureClick: (structure: Structure | null) => void
}
const StructureLabels = (props: Props) => {
  const { onStructureClick } = props
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    const font = new FontFaceObserver('Gabriela')
    void font.load().then(() => {
      setFontLoaded(true)
    })
  }, [])

  if (!fontLoaded) return null
  return (
    <Container name="structure-labels">
      <StructureLabel structure={'tavern'} x={645} y={535} onStructureClick={onStructureClick} />
      <StructureLabel structure={'warehouse'} x={430} y={130} onStructureClick={onStructureClick} />
      <StructureLabel structure={'lumberMill'} x={235} y={410} onStructureClick={onStructureClick} />
      <StructureLabel structure={'alchemist'} x={375} y={460} onStructureClick={onStructureClick} />
      <StructureLabel structure={'weaponsmith'} x={435} y={495} onStructureClick={onStructureClick} />
      <StructureLabel structure={'armoursmith'} x={515} y={425} onStructureClick={onStructureClick} />
      <StructureLabel structure={'weaver'} x={555} y={370} onStructureClick={onStructureClick} />
      <StructureLabel structure={'tannery'} x={255} y={520} onStructureClick={onStructureClick} />
      <StructureLabel structure={'mine'} x={185} y={590} onStructureClick={onStructureClick} />
      <StructureLabel structure={'workshop'} x={345} y={660} onStructureClick={onStructureClick} />
      <StructureLabel structure={'quarry'} x={685} y={666} onStructureClick={onStructureClick} />
      <StructureLabel structure={'garden'} x={785} y={776} onStructureClick={onStructureClick} />
    </Container>
  )
}

export default StructureLabels
