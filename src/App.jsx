import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function InputForm({ showInputForm, show, updateTodosFn }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const localStrg = localStorage.getItem("todos");
        setData(JSON.parse(localStrg || "[]"));
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newData = [
            ...data,
            {
                id: data.length,
                title: formData.get("title"),
                project: formData.get("project"),
                tags: [],
                deadline: formData.get("deadline"),
                done: false,
            },
        ];
        localStorage.setItem("todos", JSON.stringify(newData));
        setData(newData);
        e.target.reset();
        updateTodosFn(newData);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={
                "w-full absolute transition-[top] duration-100 rounded-4xl py-6 px-8 h-full bg-slate-100 items-center justify-start flex-col flex gap-6 " +
                (show ? "top-[0%]" : "top-full")
            }
        >
            <div className="w-full mb-8 justify-end flex">
                <button
                    type="button"
                    onClick={() => showInputForm(false)}
                    className="text-2xl cursor-pointer"
                >
                    <IoClose />
                </button>
            </div>

            <div className="w-full flex flex-col justify-center items-start">
                <span className="text-gray-500 font-extralight">To-do</span>
                <input
                    name="title"
                    className="w-full text-black font-semibold text-lg outline-0 py-4"
                    placeholder="Task title"
                    type="text"
                />
            </div>

            <div className="w-full flex flex-col justify-center items-start">
                <span className="text-gray-500 mb-3 font-extralight">
                    Project
                </span>
                <div className="w-full flex justify-center items-center border rounded-xl border-black/25 p-4">
                    <select
                        name="project"
                        className="w-full text-black font-semibold border-black/25 text-lg outline-0"
                    >
                        <option value="home">Home</option>
                        <option value="lms">LMS</option>
                        <option value="school">School</option>
                    </select>
                </div>
            </div>

            <div className="w-full flex flex-col justify-center items-start">
                <span className="text-gray-500 font-extralight">Tags</span>
                <button
                    type="button"
                    className="py-4 text-blue-400 flex gap-4 cursor-pointer"
                >
                    <FaPlus /> Add Tags
                </button>
            </div>

            <div className="w-full flex flex-col justify-center items-start">
                <span className="text-gray-500 mb-3 font-extralight">
                    Deadline
                </span>
                <input
                    name="deadline"
                    className="border p-4 rounded-xl border-black/25"
                    type="date"
                />
            </div>

            <button
                type="submit"
                className="w-full py-4 shadow shadow-blue-900 rounded-xl bg-blue-500 text-white text-center"
            >
                Done
            </button>
        </form>
    );
}

function TodoCard({ title, done, project, tags, deleteFn, checkedFn }) {
    const titleRef = useRef();

    function checkChange(e) {
        if (e.target.checked) {
            titleRef.current.style.textDecorationLine = "line-through";
            titleRef.current.style.color = "gray";
        } else {
            titleRef.current.style.textDecorationLine = "none";
            titleRef.current.style.color = "black";
        }
        checkedFn(e.target.checked);
    }

    return (
        <div className="w-full shadow-sm shadow-slate-200 bg-white rounded-xl p-4 h-fit flex items-center flex-row justify-center gap-6">
            <div className="h-full w-fit items-center justify-start">
                <input defaultChecked={done} onChange={checkChange} type="checkbox" />
            </div>
            <div className="grow flex justify-start items-start flex-col gap-2">
                <div className="w-full flex items-start flex-col gap-1">
                    <span
                        ref={titleRef}
                        className={
                            "text-black text-xl font-semibold " +
                            (done ? "line-through text-gray-500" : "")
                        }
                    >
                        {title}
                    </span>
                    <span className="text-slate-600">{project}</span>
                </div>
                {tags.map((t, i) => {
                    return (
                        <span key={"tags-" + i} className="text-sm">
                            {t}
                        </span>
                    );
                })}
            </div>
            <div className="h-full items-center flex">
                <FaTrash
                    onClick={deleteFn}
                    className="cursor-pointer text-red-400"
                />
            </div>
        </div>
    );
}

function Home({ showInputForm, todos, setTodos }) {
    function deleteTodo(id) {
        const tds = [...todos];
        const index = tds.findIndex((t) => t.id === id);
        tds.splice(index, 1);
        setTodos(tds);
        localStorage.setItem("todos", JSON.stringify(tds));
    }

    function checkedUpdate(id, checked) {
        localStorage.setItem(
            "todos",
            JSON.stringify(
                todos.map((d) => {
                    if (d.id === id) {
                        d.done = checked;
                    }
                    return d;
                }),
            ),
        );
    }

    return (
        <div className="py-6 px-8 w-full flex h-full justify-start items-center flex-col relative">
            <h1 className="w-full text-5xl font-bold py-6">Today</h1>
            <div className="w-full py-4 h-fit flex justify-center items-center flex-col gap-4">
                {todos.map((d, i) => {
                    return (
                        <TodoCard
                            checkedFn={(checked) =>
                                checkedUpdate(d.id, checked)
                            }
                            deleteFn={() => deleteTodo(d.id)}
                            {...d}
                            key={"card-" + i}
                        />
                    );
                })}
            </div>
            <button
                onClick={() => showInputForm(true)}
                className="font-bold text-3xl cursor-pointer flex justify-center items-center absolute right-8 bottom-8 w-[70px] h-[70px] rounded-2xl bg-blue-400 text-white"
            >
                <FaPlus />
            </button>
        </div>
    );
}

export default function App() {
    const [showInputForm, setShowInputForm] = useState(false);
    const [todos, setTodos] = useState([]);
    useEffect(() => {
        const localStrg = localStorage.getItem("todos");
        setTodos(JSON.parse(localStrg || "[]"));
    }, []);

    function updateTodos(newTodos) {
        setTodos(newTodos);
    }

    return (
        <div className="w-full h-fit items-center flex-center flex flex-col">
            <div className="w-110 overflow-hidden shadow-lg relative bg-slate-100 rounded-4xl h-175 flex justify-start flex-col items-center">
                <Home
                    setTodos={setTodos}
                    todos={todos}
                    showInputForm={setShowInputForm}
                />
                <InputForm
                    updateTodosFn={updateTodos}
                    showInputForm={setShowInputForm}
                    show={showInputForm}
                />
            </div>
        </div>
    );
}
