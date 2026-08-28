import * as Dashboard from "../../API_service_layer/Dashboard.js";
import * as Users from "../../API_service_layer/Users.js";
const LibrarystatisticsUI = 
{
    totalBooks : document.getElementById("totalBooks"),
    totalAuthors : document.getElementById("totalAuthors"),
    totalCategories : document.getElementById("totalCategories"),
    totalMembers : document.getElementById("totalMembers"),
    activeBorrowings : document.getElementById("activeBorrowings"),
    overdueBorrowings : document.getElementById("overdueBorrowings")
}
const popularlist = document.getElementById("popular-list");
const categoryPanel = document.getElementById("category-list");
const tableBody = document.getElementById("recent-borrowings-body");
const user = await Users.login("Jemes123@example.com","123");
const dashbaord = await Dashboard.getDashboardStats();
const PopularbooksList = await Dashboard.GetPopularBooksIsReturned();
const BooksByCategory = await Dashboard.GetBooksByCategory();
const recentBorrowings = await Dashboard.GetRecentborrowings();
function LoadPapularbooks() 
{
    popularlist.replaceChildren();

    PopularbooksList.forEach(Popularbook => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        const divinfo = document.createElement("div");
        const strong = document.createElement("strong");
        const small = document.createElement("small");

        span.textContent = Popularbook.bookId;
        strong.textContent = Popularbook.title;
        small.textContent = `${Popularbook.borrowCount} borrowings`;

        li.append(span, divinfo);
        divinfo.append(strong, small);
        popularlist.appendChild(li);
    });
}
function LoadBooksByCategory() 
{
    categoryPanel.replaceChildren();
    BooksByCategory.slice(0, 5).forEach(BC => {
        const divCategory = document.createElement("div");
        const divInfo = document.createElement("div");
        const NameCategory = document.createElement("span");
        const totalbooks = document.createElement("strong");
        const barCategory = document.createElement("i");

        divCategory.className = "category-bar";
        NameCategory.textContent = BC.nameCategory;
        totalbooks.textContent = BC.totalBooks;
        barCategory.style.width = BC.totalBooks >= 100 ? 100 : BC.totalBooks;

        divCategory.append(barCategory);
        divInfo.append(NameCategory, totalbooks);
        divCategory.append(divInfo);
        categoryPanel.append(divCategory);
    });
}
function LoadRecentBorrowings() {

    tableBody.replaceChildren();

    recentBorrowings
        .slice(0, 4)
        .forEach(borrowing => {

            const row =
                document.createElement("tr");

            const memberCell =
                document.createElement("td");

            const bookCell =
                document.createElement("td");

            const statusCell =
                document.createElement("td");

            const dateCell =
                document.createElement("td");

            const statusBadge =
                document.createElement("span");


            memberCell.textContent =
                borrowing.memberName;

            bookCell.textContent =
                borrowing.bookTitle;


            const status =
                borrowing.status?.toLowerCase();

            statusBadge.className =
                `badge ${
                    status === "returned"
                        ? "badge--warning"
                        : "badge--success"
                }`;

            statusBadge.textContent =
                borrowing.status;


            const borrowingDate =
                new Date(borrowing.datee);

            dateCell.textContent =
                Number.isNaN(borrowingDate.getTime())
                    ? borrowing.datee
                    : borrowingDate.toLocaleDateString();


            statusCell.appendChild(statusBadge);

            row.append(
                memberCell,
                bookCell,
                statusCell,
                dateCell
            );

            tableBody.appendChild(row);
        });
}
function LoadData() 
{
    try 
    {
        LibrarystatisticsUI.totalBooks.textContent = dashbaord.totalBooks;
        LibrarystatisticsUI.totalAuthors.textContent = dashbaord.totalAuthors;
        LibrarystatisticsUI.totalCategories.textContent = dashbaord.totalCategories;
        LibrarystatisticsUI.totalMembers.textContent = dashbaord.totalMembers;
        LibrarystatisticsUI.activeBorrowings.textContent = dashbaord.activeBorrowings;
        LibrarystatisticsUI.overdueBorrowings.textContent = dashbaord.activeBorrowings;
        LoadPapularbooks();
        LoadBooksByCategory();
        LoadRecentBorrowings();
    } 
    catch (error) 
    {
        console.error(error);
    }
}
document.addEventListener("DOMContentLoaded", LoadData());

