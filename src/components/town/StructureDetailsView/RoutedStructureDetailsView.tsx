import { Structure } from "definitions/structures";
import { Link, useParams } from "react-router-dom";
import { TextManager } from "global/TextManager";
import Button from "components/ui/buttons/Button";
import { getStructureLink } from "utils/routing";
import StructureDetailsView from "./StructureDetailsView";
import "./styles/structuredetailsview.scss";



const RoutedStructureDetailsView = () => {
  const { structure } = useParams<{structure: Structure}>();
  const title = TextManager.getStructureName(structure)
  return (
    <div className="structure-details-window ">
      <div className="header">
        <h3>{ title }</h3>
        <Link to={getStructureLink(structure, true)}>
          <Button
            className="close-button"
            square={true}
            size={"medium"}
            color="purple"
            text="x"
          />
        </Link>
      </div>
      <StructureDetailsView structure={structure} title={title} />
    </div>
  )
}

export default RoutedStructureDetailsView;
