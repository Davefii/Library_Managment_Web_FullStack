//import { BooksList,GetBookByID } from "./Books.js";
//import { login/*, logout*/ } from "./Users.js";
/*import { getAuthors } from "./Authors.js";
import { getAllUsers, refreshAccessToken } from "./Users.js";
import { getBorrowings } from "./Borrowings.js";
import { getAllUserProfiles } from "./UsersProfile.js";*/
//import { getDashboardStats, GetBooksByCategory,GetPopularBooksIsReturned } from "./Dashboard.js";
//import * as Members from "./Members.js";
import { ListBooksByAuthorForAnyone,ListBooksByCategorieForAnyone,TotalBooksByAuthor, TotalBooksByCategory } from "../API_service_layer/Books.js";
async function test() {

    try {

        /*const loginResult =
            await login(
                "Jemes123@example.com",
                "123"
            );*/

        /*console.log("Login:", loginResult);*/

        /*const books =
            await BooksList();

        console.log("Books:", books);
        const authors = await getAuthors();
        const Users = await getAllUsers();
        const Memeber = await getMembers();
        const Borrowings = await getBorrowings();
        const UserProfiles = await getAllUserProfiles();
        console.log(authors);
        console.log(Users);
        console.log(Memeber);
        console.log(Borrowings);
        console.log(UserProfiles);

        console.log("Fetch again after refresh");
        const refresh = await refreshAccessToken();
        const authors2 = await getAuthors();
        const Users2 = await getAllUsers();
        const Memeber2 = await getMembers();
        const Borrowings2 = await getBorrowings();
        const UserProfiles2 = await getAllUserProfiles();
        console.log(refresh);
        console.log(authors2);
        console.log(Users2);
        console.log(Memeber2);
        console.log(Borrowings2);
        console.log(UserProfiles2);

        const logoutResult = await logout();
        console.log(logoutResult);
        
        console.log("Fetch again after Logout");
        const authors3 = await getAuthors();
        const Users3 = await getAllUsers();
        const Borrowings3 = await getBorrowings();
        const UserProfiles3 = await getAllUserProfiles();
        console.log(authors3);
        console.log(Users3);
        console.log(Borrowings3);
        console.log(UserProfiles3);*/
        /*const Dashbaord = await getDashboardStats();
        const BooksByCategory = await GetBooksByCategory();
        const PopularBooksIsReturned = await GetPopularBooksIsReturned();
        console.log(Dashbaord);
        console.log(BooksByCategory);
        console.log(PopularBooksIsReturned);*/
        /*const Memeber = await Members.getMembers();
        console.log(Memeber);
        
        const addNewMember = await Members.addMember();*/
        
        const bookbyauthorname = await ListBooksByAuthorForAnyone(2);
        const bookbycategorie = await ListBooksByCategorieForAnyone(1);
        const totalBooksByAuthor = await TotalBooksByAuthor(2);
        const totalBooksByCategory = await TotalBooksByCategory(2);
        console.log(bookbyauthorname);
        console.log(bookbycategorie);
        console.log(totalBooksByAuthor);
        console.log(totalBooksByCategory);
        
    }
    catch (error) {

        console.error(error);

    }
}

test();