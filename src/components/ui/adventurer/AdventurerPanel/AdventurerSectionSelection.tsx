import debounce from "debounce";
import { TextManager } from "global/TextManager";
import React, { useEffect, useRef } from "react";
import { HashLink } from 'react-router-hash-link';
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
        }, 250);
        sectionParent?.addEventListener("scroll", onScroll);
        return () => {
            sectionParent?.removeEventListener("scroll", onScroll);
        }
    }, []);
    
    return (
        <ul className="adventurer-section-selection" ref={ref}>
            <li title={TextManager.get("ui-adventurer-info-general-title")}>
                <HashLink smooth to="#common" className="active">  
                    {TextManager.get("ui-adventurer-info-general-title")[0]}
                </HashLink>
            </li>
            <li title={TextManager.get("ui-adventurer-info-skills-title")}>
                <HashLink smooth to="#skills">  
                    {TextManager.get("ui-adventurer-info-skills-title")[0]}
                </HashLink>
            </li>
            <li title={TextManager.get("ui-adventurer-info-equipment-title")}>
                <HashLink smooth to="#equipment">  
                    {TextManager.get("ui-adventurer-info-equipment-title")[0]}
                </HashLink>
            </li>
            <li title={TextManager.get("ui-adventurer-info-inventory-title")}>
                <HashLink smooth to={"#inventory" }>  
                    {TextManager.get("ui-adventurer-info-inventory-title")[0]}
                </HashLink>
            </li>
        </ul>
    )
}

export default AdventurerSectionSelection;
