# IPL Win Prediction

## Prerequisites

- Python and pip
- Node and npm

## Get started

1. Clone the repository or download the zip file onto your device.
2. Open a terminal inside the project directory.
3. Create a python virtual environment:

   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```

4. Install python dependencies:

   ```
   pip install -r requirements.txt
   ```

5. Install react client dependencies:

   ```
   cd client
   npm install
   ```

6. Build react client:

   ```
   npm run build
   cd ..
   ```

7. Run the app:

   ```
   flask --app app run
   ```
