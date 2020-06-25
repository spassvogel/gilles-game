import { TextEntry } from "constants/text";
import itemDefinitions, { getDefinition } from "definitions/items";
import { Item, ItemType } from "definitions/items/types";
import { Resource } from "definitions/resources";
import { Structure } from "definitions/structures";
import * as Handlebars from "handlebars";

export abstract class TextManager {

    public static init(texts: Record<string, string>, precompile = true) {
        this.texts = texts;
        this.templates = {};
        if (precompile) {
            this.compileAll();
        }
        this.initialized = true;
    }

//    public static addTexts(texts: Record<string, string>)
    public static get(key: string, context?: any): string {
        const result = this.getDefault(key, context);
        if (result === null) {
            // tslint:disable-next-line: no-console
            console.error(`Key '${key}' not found in TextManager`);
            return `<<'${key}' missing>>`;
        } else {
            return result;
        }
    }

    // Will return `null` when no text found, otherwise will return the text
    public static getDefault(key: string, context?: any): string|null {
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

    public static getQuestTitle(name: string) {
        return this.get(`quest-${name}-title`);
    }

    public static getQuestDescription(name: string) {
        return this.get(`quest-${name}-description`);
    }

    public static getResourceName(type: Resource) {
        return this.get(`resource-${type}-name`);
    }

    public static getItemName(item: Item): string {
        const itemType = ItemType[getDefinition(item).itemType];
        return this.get(`item-${itemType}-${item}-name`);
    }
    public static getItemSubtext(item: Item): string|null {
        const itemType = ItemType[getDefinition(item).itemType];
        return this.getDefault(`item-${itemType}-${item}-subtext`);
    }

    public static getStructureName(structure: Structure): string {
        return this.get(`structure-${structure}-name`);
    }

    private static initialized = false;
    private static texts: Record<string, string>;
    private static templates: Record<string, Handlebars.TemplateDelegate<any>>;

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
    if (!itemDefinitions[item]) {
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
            const name = itemDefinitions[item].name;
            return new Handlebars.SafeString(name);
    }
});
Handlebars.registerHelper("structure:name", (structure: string) => {
    const name = TextManager.get(`structure-${structure}-name`);
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
