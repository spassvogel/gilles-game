import * as Handlebars from "handlebars";
import itemDefinitions from "src/definitions/items";

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
        if (!this.initialized) {
            throw new Error(`Error ${this} not initialized!`);
        }
        const template = this.getTemplate(key);
        if (!template) {
            console.error(`Key '${key}' not found in TextManager`)
            return `<<'${key}' missing>>`;
        }
        return template(context);
    }

    public static getTemplate(key: string) {
        let template = this.templates[key];
        if (!template && this.texts[key]) {
            // Template not found. Needs to be compiled
            this.compile(key, this.texts[key]);
            template = this.templates[key];
        }
        return template;
    }

    public static getQuestTitle(name: string) {
        return this.get(`quest-${name}-title`);
    }

    public static getResourceName(type: string) {
        return this.get(`resource-${type}-name`);
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

Handlebars.registerHelper("item:name", (item: string, article?: string) => {
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

const itemArticleAuto = (item: string) => {
    return itemArticleUndefined(item);
};

const itemArticleUndefined = (item: string) => {
    const name = itemDefinitions[item].name;
    const articleTemplate = TextManager.getTemplate("common-article-undefined");
    return new Handlebars.SafeString(`${articleTemplate({ noun: name})}`);
};

const itemArticleDefined = (item: string) => {
    const name = itemDefinitions[item].name;
    const articleTemplate = TextManager.getTemplate("common-article-defined");
    return new Handlebars.SafeString(`${articleTemplate({ noun: name})}`);
};
