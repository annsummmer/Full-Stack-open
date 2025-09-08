sequenceDiagram
participant browser
participant server

    Note over browser,server: The user writes a note and clicks the 'Save' button in the SPA

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: The server receives and saves the new note
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: The browser's JavaScript fetches the updated data to refresh the view

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: The updated JSON data including the new note
    deactivate server

    Note right of browser: The browser's JavaScript renders the notes on the page, now showing the new note