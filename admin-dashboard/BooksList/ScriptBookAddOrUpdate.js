import * as Book from "../../API_service_layer/Books.js";
import {getCategories} from  "../../API_service_layer/Category.js";
import {getAuthors} from "../../API_service_layer/Authors.js";
let Mode = 0;// AddNew = 0, Update = 1
let BookId = null;
let listAuthors = [];
let listCategories = [];
const ElementUI = 
{
    title : document.getElementById("title"),
    isbn : document.getElementById("isbn"),
    publishYear : document.getElementById("publishYear"),
    listAuthors : document.getElementById("authorId"),
    categoryId : document.getElementById("categoryId"),
    copiesCount : document.getElementById("copies"),
    availableCopies : document.getElementById("availableCopies"),
    isAvailable : document.getElementById("isAvailable"),
    description : document.getElementById("description"),
    btnSave : document.getElementById("btnSave"),
    imagePath : document.getElementById("imagePath"),
    formTitle: document.getElementById("formTitle"),
    DisplayImage : document.getElementById("DisplayImage"),
    btnClose : document.getElementById("btnClose")
};

function loadListAuthors() {
    ElementUI.listAuthors.replaceChildren();
    listAuthors.forEach(Author => {
        const optionAuthors = document.createElement("option");
        const authorId = Author.id ?? Author.Id ?? Author.ID;
        const firstName = Author.firstName ?? Author.FirstName ?? "";
        const lastName = Author.lastName ?? Author.LastName ?? "";
        optionAuthors.value = authorId;
        optionAuthors.textContent = `${firstName} ${lastName}`.trim();
        ElementUI.listAuthors.append(optionAuthors);
    });
}
function LoadListCategorie() {
    ElementUI.categoryId.replaceChildren();
    listCategories.forEach(category => {
        const optionCategory = document.createElement("option");
        const categoryId = category.id ?? category.Id ?? category.ID;
        const categoryName = category.name ?? category.Name ?? "";
        optionCategory.value = categoryId;
        optionCategory.textContent = categoryName;
        ElementUI.categoryId.append(optionCategory);
    });
}
function setSelectedOption(selectElement, value) {
    if (value === null || value === undefined) {
        return;
    }

    const option = Array.from(selectElement.options)
        .find(item => String(item.value) === String(value));

    if (option) {
        option.selected = true;
    }
}

function DetectMode() {
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    if (id !== null) {
        BookId = Number(id);
        Mode = 1;
    } 
    else {
        BookId = null;
        Mode = 0;
    }
}
async function Save(event) {

    event.preventDefault();

const book = {

        title: ElementUI.title.value.trim(),

        isbn: ElementUI.isbn.value.trim(),

        description:
            ElementUI.description.value.trim(),

        publishYear:
            Number(ElementUI.publishYear.value),

        totalCopies:
            Number(ElementUI.copiesCount.value),

        availableCopies:
            Number(ElementUI.availableCopies.value),

        isAvailable:
            ElementUI.isAvailable.checked,

        authorID:
            Number(ElementUI.listAuthors.value),

        categoryID:
            Number(ElementUI.categoryId.value),

        coverImage:
            ElementUI.imagePath.files[0] ?? null
    };
    try {
        if (Mode === 0) {
            const createdBook = await Book.addBook(book);
            // Get ID returned by API
            BookId =
            createdBook.id ??
                createdBook.Id ??
                createdBook.ID;
                
            if (!BookId) {
                throw new Error(
                    "Book created successfully, but the API did not return the Book ID."
                );
            }
            Mode = 1;
            alert("Book created successfully.");
            await LoadDataUpdateMode();
        }
        else {
            await Book.updateBook(
                BookId,
                book
            );
            alert("Book updated successfully.");
        }

    }
    catch (error) {

        console.error(error);
        alert(error.message);
    }
}
function LoadDataAddMode() {
        ElementUI.formTitle.textContent =
        "Add New Book";

    ElementUI.btnSave.textContent =
        "Create Book";
    ElementUI.title.value = "";
    ElementUI.isbn.value = "";
    ElementUI.publishYear.value = "";
    ElementUI.copiesCount.value = "";
    ElementUI.availableCopies.value = "";
    ElementUI.isAvailable.checked = true;
    ElementUI.description.value = "";
}
async function LoadDataUpdateMode()
{
    ElementUI.formTitle.textContent = "Update Book";
    ElementUI.btnSave.textContent = "Update Book";
      const book =
          await Book.GetBookByID(BookId);

    if (!book) {

        alert("Cannot find this book.");

        return;
    }

    ElementUI.title.value =
        book.title ?? "";

    ElementUI.isbn.value =
        book.isbn ?? "";

    ElementUI.publishYear.value =
        book.publishYear ?? book.PublishYear ?? "";

    ElementUI.copiesCount.value =
        book.totalCopies ?? book.copiesCount ?? "";

    ElementUI.availableCopies.value =
        book.availableCopies ?? book.AvailableCopies ?? "";

    ElementUI.isAvailable.checked =
        book.isAvailable ?? book.IsAvailable ?? false;

    ElementUI.description.value =
        book.description ?? "";

    
    ElementUI.DisplayImage.src = `https://localhost:7010/${book.coverImage}`;
    const authorId = book.authors?.[0]?.id;
    const categoryId = book.categories?.[0]?.id;
    setSelectedOption(ElementUI.listAuthors, authorId);
    setSelectedOption(ElementUI.categoryId, categoryId);
}
async function LoadData() {
    try 
    {
        DetectMode();
        listAuthors = await getAuthors();
        listCategories = await getCategories();
        loadListAuthors();
        LoadListCategorie();
        if (Mode === 0) {
            LoadDataAddMode();
        } else {
            await LoadDataUpdateMode();
        }
    } 
    catch (error) 
    {
        console.error(error);

        alert(
            "Failed to load book form."
        );
        window.close();
        return;
    }
}
ElementUI.btnSave.addEventListener(
    "click",
    Save
);
ElementUI.btnClose.addEventListener("click", () =>{window.close();});
document.addEventListener("DOMContentLoaded",LoadData);