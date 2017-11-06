import Word from "word";
$(() => {
    new Word({
        path: "stopword",
        listParam: "stopword",
        wordName: "停用词",
        addParam: "stopword",
        delType: "GET"
    });
});
