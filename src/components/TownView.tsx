// // OBSOLETE
// import * as React from "react";
// import structureDefinitions, {  Structure, StructureDefinition  } from "src/definitions/structures";
// import { StructuresStoreState } from "src/stores/structures";
// import { TextManager } from "src/utils/textManager";
// import "./css/townView.css";

// export interface DispatchProps {
//     onStructureClick?: (structure: Structure) => void;
// }

// // tslint:disable-next-line:no-empty-interface
// export interface Props {

// }

// export interface StateProps {
//     structures: StructuresStoreState;
// }

// export default function(props: Props & DispatchProps & StateProps) {

//     const handleStructureClick = (structure: Structure) => {
//         if (props.onStructureClick) { props.onStructureClick(structure); }
//     };

//     const structures: Structure[] = [
//         Structure.lumberMill,
//         Structure.garden,
//         Structure.tannery,
//         Structure.weaponsmith,
//         Structure.armoursmith,
//         Structure.warehouse,
//     ];

//     const list = structures.map((s) => {
//         const structureDefinition: StructureDefinition = structureDefinitions[s] as StructureDefinition;
//         const levelDefinition = structureDefinition.levels[props.structures[s].level];
//         const displayName = TextManager.get(levelDefinition.displayName);
//         return  <li
//             onClick = { () => handleStructureClick(s) }> { displayName }
//         </li>;
//     });

//     return (
//         <div className = "town-view">
//             <fieldset>
//                 <legend>Town</legend>
//                 <ul>
//                     { list }
//                 </ul>
//             </fieldset>
//         </div>
//     );
// }
