import { paramCase as toKebab} from "text-param-case";
import { TextEntry } from "constants/text";
import { getDefinition } from "definitions/items";
import { Item, ItemType } from "definitions/items/types";
import { Resource } from "definitions/resources";
import { Structure } from "definitions/structures";
import * as Handlebars from "handlebars";
import { Trait } from 'definitions/traits/types';
import { Type } from 'components/ui/toasts/Toast';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { WeaponType, WeaponClassification } from 'definitions/items/weapons';
import { getStructureLink } from "utils/routing";

export abstract class TextManager {

    public static init(texts: {[key: string]: string}, precompile = true) {
        this.texts = texts;
        this.templates = {};
        this.notFound = [];

        if (precompile) {
            this.compileAll();
        }
        this.initialized = true;
    }

    public static get(key: string, context?: unknown): string {
        const result = this.getDefault(key, context);
        if (result === null) {
            if (process.env.NODE_ENV === 'development') {
                this.notFound.push(key)
            }
    
            console.error(`Key '${key}' not found in TextManager`);
            return `<<'${key}' missing>>`;
        } else {
            return result;
        }
    }

    // Will return `null` when no text found, otherwise will return the text
    public static getDefault(key: string, context?: unknown): string|null {
        if (!this.initialized) {
            throw new Error(`Error ${this} not initialized!`);
        }
        const template = this.getTemplate(key);
        if (!template) {
            return null;
        }
        return template(context);
    }

    public static getTextEntry(textEntry: TextEntry): string {
        return this.get(textEntry.key, textEntry.context);
    }

    public static getTemplate(key: string) {
        let template = this.templates[key];
        if (!template && this.texts[key]) {
            // Template not found but key is defined. Needs to be compiled
            this.compile(key, this.texts[key]);
            template = this.templates[key];
        }
        return template;
    }

    public static getEquipmentSlot(slotType: EquipmentSlotType) {
        return this.get(`ui-equipmentslot-${toKebab(EquipmentSlotType[slotType])}`);
    }

    public static getQuestTitle(name: string) {
        return this.get(`quest-${toKebab(name)}-title`);
    }

    public static getQuestDescription(name: string) {
        return this.get(`quest-${toKebab(name)}-description`);
    }

    public static getResourceName(type: Resource) {
        return this.get(`resource-${type}-name`);
    }

    public static getItemName(item: Item): string {
        return this.get(`item-${toKebab(item)}-name`);
    }
    public static getItemType(itemType: ItemType): string {
        return this.get(`item-type-${toKebab(ItemType[itemType])}`);
    }

    public static getItemSubtext(item: Item): string|null {
        return this.getDefault(`item-${toKebab(item)}-subtext`);
    }

    public static getStructureName(structure: Structure): string {
        return this.get(`structure-${toKebab(structure)}-name`);
    }

    public static getTraitName(trait: Trait): string {
        return this.get(`trait-${toKebab(trait)}-name`);
    }

    public static getTraitDescription(trait: Trait): string {
        return this.get(`trait-${toKebab(trait)}-description`);
    }

    public static getTraitEffect(trait: Trait): string {
        return this.get(`trait-${toKebab(trait)}-effect`);
    }

    public static getToastType(type: Type): string {
        return this.get(`ui-toast-type-${toKebab(Type[type])}`);
    }

    public static getWeaponType(type: WeaponType) {
        return this.get(`ui-weapon-type-${toKebab(WeaponType[type])}`);
    }

    public static getSkillName(type: WeaponType) {
        return this.get(`skill-${toKebab(WeaponType[type])}-name`);
    }

    public static getSkillInfo(type: WeaponType) {
        return this.get(`skill-${toKebab(WeaponType[type])}-info`);
    }

    public static getWeaponClassification(weaponClass: WeaponClassification) {
        return this.get(`ui-weapon-class-${toKebab(WeaponClassification[weaponClass])}`);
    }

    public static printNotFounds() {
        if (this.notFound.length) {
            console.log("TextManager strings not found:")
            console.log("\"" + this.notFound.join('": "",\n"') + '": ""')
        }
    }

    private static initialized = false;
    private static texts: Record<string, string>;
    private static templates: Record<string, Handlebars.TemplateDelegate<unknown>>;
    private static notFound: string[];

    private static compileAll() {
        Object.keys(this.texts).forEach((key: string) =>  {
            this.compile(key, this.texts[key]);
        });
    }

    private static compile(key: string, value: string) {
        const template = Handlebars.compile(value);
        this.templates[key] = template;
    }
}

Handlebars.registerHelper("item:name", (item: Item, article?: string) => {
    if (!getDefinition(item)) {
        return new Handlebars.SafeString(`<<ITEM DEFINITION NOT FOUND: ${item}>>`);
    }
    switch (article) {
        case "aA":  // article Auto
            return itemArticleAuto(item);
        case "aD":  // article Defined "a sword"
            return itemArticleDefined(item);
        case "aU":  // article Defined "the sword"
            return itemArticleDefined(item);
        default:
            // No article
            // const name = itemDefinitions[item].name;
            return new Handlebars.SafeString(item);
    }
});

Handlebars.registerHelper("structure:name", (structure: Structure) => {
    const name = TextManager.get(`structure-${toKebab(structure)}-name`);
    return new Handlebars.SafeString(name);
});

Handlebars.registerHelper("structure:link", (structure: Structure) => {
    const name = TextManager.get(`structure-${toKebab(structure)}-name`);
    const link = getStructureLink(structure)
    return new Handlebars.SafeString( `[${name}](#${link})`);
});

Handlebars.registerHelper("resource:name", (resource: string) => {
    const name = TextManager.get(`resource-${resource}-name`);
    return new Handlebars.SafeString(name);
});

const itemArticleAuto = (item: Item) => {
    return itemArticleUndefined(item);
};

const itemArticleUndefined = (item: Item) => {
    const name = TextManager.getItemName(item);
    const articleTemplate = TextManager.getTemplate("common-article-undefined");
    return new Handlebars.SafeString(`${articleTemplate({ noun: name})}`);
};

const itemArticleDefined = (item: Item) => {
    const name = TextManager.getItemName(item);
    const articleTemplate = TextManager.getTemplate("common-article-defined");
    return new Handlebars.SafeString(`${articleTemplate({ noun: name})}`);
};
