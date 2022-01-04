import React, { useEffect, useRef } from "react";
import debounce from "debounce";
import { TextManager } from "global/TextManager";
import { HashLink } from 'react-router-hash-link';
import iconPerson from './styles/images/icon-person.png';
import iconHelmet from './styles/images/icon-helmet.png';
import iconCrosshair from './styles/images/icon-crosshair.png';
import iconSword from './styles/images/icon-sword.png';
import "./styles/adventurerSectionSelection.scss"

const AdventurerSectionSelection = () => {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sectionParent = ref?.current?.parentNode as HTMLElement;

    const onScroll = debounce(() => {
      const fromTop = sectionParent.scrollTop;
      ref.current?.querySelectorAll("a")?.forEach(link => {
        const hash = link.hash.substring(link.hash.lastIndexOf("#"));
        const section = document.querySelector(hash) as HTMLElement;

        if (section && section.offsetTop <= fromTop && section.offsetTop + section.clientHeight > fromTop) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }, 50);
    sectionParent?.addEventListener("scroll", onScroll);
    return () => {
      sectionParent?.removeEventListener("scroll", onScroll);
    }
  }, []);

  return (
    <ul className="adventurer-section-selection" ref={ref}>
      <li title={TextManager.get("ui-adventurer-info-general-title")}>
        <HashLink smooth to="#common" className="active">
          <img src={iconPerson} alt={TextManager.get("ui-adventurer-info-general-title")} />
        </HashLink>
      </li>
      <li title={TextManager.get("ui-adventurer-info-skills-title")}>
        <HashLink smooth to="#skills">
          <img src={iconCrosshair} alt={TextManager.get("ui-adventurer-info-skills-title")}/>
        </HashLink>
      </li>
      <li title={TextManager.get("ui-adventurer-info-equipment-title")}>
        <HashLink smooth to="#equipment">
          <img src={iconHelmet} alt={TextManager.get("ui-adventurer-info-equipment-title")}/>
        </HashLink>
      </li>
      <li title={TextManager.get("ui-adventurer-info-inventory-title")}>
        <HashLink smooth to={"#inventory" }>
          <img src={iconSword} alt={TextManager.get("ui-adventurer-info-inventory-title")}/>
        </HashLink>
      </li>
    </ul>
  )
}

export default AdventurerSectionSelection;
