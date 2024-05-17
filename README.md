# DJS03 Project Brief: Book Connect - Abstractions

The focus of this project is to enhance the code's maintainability, extendibility, and readability by applying concepts of objects and functions for abstraction. To complete this coding challenge I had to apply higher-level concepts like documentation, Styleguides, and abstraction principles.

![alt text](image.png)

#### Goals

- **Refactor Existing Code**: Analyze and refactor the given JavaScript and HTML code to improve its structure using objects and functions.
- **Implement Abstraction**: Use abstraction to hide the complex reality while exposing only the necessary parts. This involves creating more generic functions that can perform tasks in a more flexible way.
- **Documentation**: Write clear comments and documentation for the new code structure to explain the purpose and functionality of code blocks, functions, and objects.
- **Follow Styleguides**: Adhere to established coding conventions and Styleguides to ensure code readability and maintainability.

#### Tasks

1. **Code Analysis**: Start by understanding the current implementation of the "Book Connect" application, including its HTML structure and JavaScript functionality.

2. **Implement Abstraction**:

   - **Objects**: Define objects to represent key elements of the application, such as books, authors, and genres. Utilize the provided data (e.g., `authors`, `genres`, `books`) to populate these objects.

   - **Functions**: Created functions that handle repetitive tasks, such as rendering the book list, handling user interactions, and applying filters:

   - Lines 31 - 44 and 46 - 59: A more generic function (createSelect) can be used to create drop-down menus for authors and genres
   - Lines 9 - 29 and 180 - 203: A more generic function (displayBooksPreview) can be used to display book previews on the DOM.
   - Lines 65 - 71 and 121 - 131: The setTheme() function was used to in both instances to toggle light and dark themes.
   - Lines 74 - 86 and 206 - 215: The updateShowMoreBtn() function was used to display the show more button on the page

3. **Adherence to Styleguides**: Renamed variables so that my code follows JavaScript and HTML coding standards and best practices for readability and maintainability.

   - Line 6: replaced "starting" with "booksListDiv"
   - Lines 2 - 18: Initialized variables used for DOM manipulation for easier readability (e.g. "showMoreBtn" replaces "document.querySelector("[data-list-button]")". )
