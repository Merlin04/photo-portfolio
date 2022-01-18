import "isomorphic-fetch";

type BerowraCollection = {
    items: {
        key: string;
        lastUpdated: string;
        title: string;
    }[],
    title: string
};

type _BerowraFieldBase = {
    title: string
}

type BerowraFieldString = _BerowraFieldBase & {
    type: "String",
    value: string
};

type BerowraFieldMarkdown = _BerowraFieldBase & {
    type: "Markdown",
    value: string
};

type BerowraFieldFiles = _BerowraFieldBase & {
    type: "Files",
    value: string[]
};

type BerowraFieldDate = _BerowraFieldBase & {
    type: "Date",
    value: string
};

type BerowraFieldColor = _BerowraFieldBase & {
    type: "Colour",
    value: string
};

type BerowraField = BerowraFieldString | BerowraFieldMarkdown | BerowraFieldFiles | BerowraFieldDate | BerowraFieldColor;


type BerowraContent<T extends {
    [key: string]: BerowraField
}> = {
    collectionKey: string;
    content: T,
    lastUpdated: string,
    title: string
}

type BerowraAssignment = BerowraContent<{
    "3238393863372": BerowraFieldString
}>;

export async function getAssignments() {

}