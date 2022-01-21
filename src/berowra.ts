import "isomorphic-fetch";

type BerowraCollection = BerowraCollectionItems<{
    key: string;
    lastUpdated: string;
    title: string;
}>;

type BerowraCollectionItems<T> = {
    items: T[],
    title: string
}

type _BerowraFieldBase<T extends string = string> = {
    title: T
}

type BerowraFieldString<T extends string = string> = _BerowraFieldBase<T> & {
    type: "String",
    value: string
};

type BerowraFieldMarkdown<T extends string = string> = _BerowraFieldBase<T> & {
    type: "Markdown",
    value: string
};

type BerowraFieldFiles<T extends string = string> = _BerowraFieldBase<T> & {
    type: "Files",
    value: string[]
};

type BerowraFieldDate<T extends string = string> = _BerowraFieldBase<T> & {
    type: "Date",
    value: string
};

type BerowraFieldColor<T extends string = string> = _BerowraFieldBase<T> & {
    type: "Colour",
    value: string
};

type BerowraField = BerowraFieldString | BerowraFieldMarkdown | BerowraFieldFiles | BerowraFieldDate | BerowraFieldColor;

type BerowraContent<T extends {
    [key: string]: BerowraField
}> = {
    collectionKey: string,
    content: T,
    lastUpdated: string,
    title: string
}

type RawBerowraAssignment = BerowraContent<{
    "5325049601687": BerowraFieldString<"Info">,
    "7117674676288": BerowraFieldFiles<"Images">,
    "7369734022898": BerowraFieldDate<"Date">,
    "8807953445364": BerowraFieldColor<"Background">
}>;

type TransformContent<T extends BerowraContent<any>> = BerowraContent<{
    [FieldKey in keyof T["content"] as T["content"][FieldKey]["title"]]: T["content"][FieldKey]
}>

export type BerowraAssignment = TransformContent<RawBerowraAssignment>;

function transformContent<T extends BerowraContent<any>>(content: T): TransformContent<T> {
    return {
        ...content,
        //@ts-expect-error
        content: Object.fromEntries(Object.values(content.content).map(c => [c.title, c]))
    };
}

type Unpromisify<T extends Promise<any>> = T extends Promise<infer A> ? A : never;
export type GetAssignmentsRes = Unpromisify<ReturnType<typeof getAssignments>>;

export async function getAssignmentsCollection() {
    const res = await fetch(process.env.NEXT_PUBLIC_BEROWRA_INST + "/api/collection/" + process.env.BEROWRA_COLLECTION_ID);
    const c = (await res.json()) as BerowraCollection;
    return c;
}

export async function getAssignments() {
    const res = await fetch(process.env.NEXT_PUBLIC_BEROWRA_INST + "/api/collection/" + process.env.BEROWRA_COLLECTION_ID + "?content");
    const c = (await res.json()) as BerowraCollectionItems<RawBerowraAssignment>;
    return {
        ...c,
        items: c.items.map(i => transformContent(i))
    };
}

export async function getAssignment(key: string) {
    const res = await fetch(process.env.NEXT_PUBLIC_BEROWRA_INST + "/api/content/" + key);
    return transformContent((await res.json()) as RawBerowraAssignment);
}