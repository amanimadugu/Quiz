import React, { useRef, useState } from 'react';
import { data } from './data.js';  // Ensure data.js has the right structure
import './quiz2.css';

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // New state for error message

    // Refs for options
    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);
    const option_array = [option1, option2, option3, option4];

    const [selected, setSelected] = useState(null); // Track selected option

    // Ensure data is not empty or invalid
    if (!data || data.length === 0) {
        return <div>Error: No quiz data available.</div>;
    }

    // Get the current question from the data array
    const question = data[index];

    // Error handling: If no question exists at the current index
    if (!question) {
        return <div>Error: Question data is not available or index is out of bounds.</div>;
    }

    const checkAns = (e, ans) => {
        if (!lock) {
            setSelected(ans);  // Mark the selected option
            // Mark the selected option as correct or wrong
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1); // Increment score for correct answer
            } else {
                e.target.classList.add("wrong");
                // Mark the correct option as well
                option_array[question.ans - 1].current.classList.add("correct");
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock) {
            // Check if the user has selected an option
            if (selected === null) {
                setErrorMessage("Please select an option before moving to the next question.");
                return;
            }

            setErrorMessage(""); // Clear error message if an option is selected

            if (index === data.length - 1) {
                setResult(true);
                return;
            }

            setIndex(prevIndex => prevIndex + 1);
            setLock(false);
            setSelected(null); // Reset selected option

            // Reset all options' classes when moving to the next question
            option_array.forEach(option => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            });
        }
    };

    const reset = () => {
        setIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
        setErrorMessage(""); // Clear error message on reset
        setSelected(null); // Reset selected option
    };

    return (
        <div className="ammu">
        <div className="container">
            <h1>Quiz App</h1>
            <hr />
            {!result ? (
                <>
                    <h2>
                        {index + 1}. {question.question}
                    </h2>
                    <ul>
                        <li ref={option1} onClick={(e) => checkAns(e, 1)}>
                            {question.option1}
                        </li>
                        <li ref={option2} onClick={(e) => checkAns(e, 2)}>
                            {question.option2}
                        </li>
                        <li ref={option3} onClick={(e) => checkAns(e, 3)}>
                            {question.option3}
                        </li>
                        <li ref={option4} onClick={(e) => checkAns(e, 4)}>
                            {question.option4}
                        </li>
                    </ul>
                    <button onClick={next}>Next</button>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error message */}
                    <div className="index">
                        {index + 1} of {data.length} questions
                    </div>
                </>
            ) : (
                <>
                    <h2>
                        You Scored {score} out of {data.length}
                    </h2>
                    <button onClick={reset}>Reset</button>
                </>
            )}
        </div>
        </div>
    );
};

export default Quiz;
