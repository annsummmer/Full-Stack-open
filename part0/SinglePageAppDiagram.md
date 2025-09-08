sequenceDiagram
participant browser
participant server

    Note over browser,server: The user writes a note and clicks 'Save'

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created
    deactivate server

    Note right of browser: The browser re-fetches the notes to display the updated list

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ..., { "content": "New note content", "date": "current date" }]
    deactivate server

    Note right of browser: The browser renders the updated list of notes including the new note