import React from "react";
import { useState, useEffect } from "react";
import action from "../services/actions";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState({ message: null, type: "" });

  useEffect(() => {
    action.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleText = (event) => {
    setNewName(event.target.value);
  };

  const handleNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleForm = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) {
        action
          .update(existingPerson.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNotification({
              message: `Updated ${returnedPerson.name}`,
              type: "success",
            });
            setTimeout(() => {
              setNotification({ message: null, type: "" });
            }, 5000);
          })
          .catch((error) => {
            setNotification({
              message: `Information of ${existingPerson.name} has already been removed from server`,
              type: "error",
            });
            setTimeout(() => {
              setNotification({ message: null, type: "" });
            }, 5000);
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id)
            );
          });
      }
    } else {
      action.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotification({
          message: `Added ${returnedPerson.name}`,
          type: "success",
        });
        setTimeout(() => {
          setNotification({ message: null, type: "" });
        }, 5000);
      });
    }
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm("Are you sure you want to delete this contact?")) {
      action
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setNotification({
            message: `Deleted ${person.name}`,
            type: "success",
          });
          setTimeout(() => {
            setNotification({ message: null, type: "" });
          }, 5000);
        })
        .catch((error) => {
          setNotification({
            message: `Information of ${person.name} has already been removed from server`,
            type: "error",
          });
          setTimeout(() => {
            setNotification({ message: null, type: "" });
          }, 5000);
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const filteredItems = persons.filter((person) =>
    new RegExp(search, "i").test(person.name)
  );
  const displayData = search ? filteredItems : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter filter={search} handleFilterChange={handleSearch} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={handleForm}
        newName={newName}
        handleNameChange={handleText}
        newNumber={newNumber}
        handleNumberChange={handleNumber}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={displayData} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
