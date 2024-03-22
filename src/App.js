import './App.css';
import axios from "axios";

function App() {

  async function submitTest(event) {
    event.preventDefault();
    console.log(event.target);

    const formData = new FormData(event.target);

    const formDataJson = {};
    formData.forEach((value, key) => {
      formDataJson[key] = value;
    })

    console.log(formDataJson);

    await axios.post("http://localhost:3000/insertQuestion", formDataJson)
      .then((res) => {
        console.log(res);
        event.target.questionText.value = "";
        event.target.questionMarks.value = 0;
      })
      .catch((err) => console.error(err));
  }

  return (
    <>
      <h1>Add a question</h1>
      <form action="" onSubmit={(event) => submitTest(event)}>
        <label htmlFor="questionText">Question: </label>
        <input type="text" name="questionText" id="questionText" autoComplete="false" />
        <br />
        <label htmlFor="questionMarks">Marks: </label>
        <input type="number" name="questionMarks" id="questionMarks" />
        <br />
        <input type="submit" value="submitQuestion" />
      </form>
    </>
  );
}

export default App;
