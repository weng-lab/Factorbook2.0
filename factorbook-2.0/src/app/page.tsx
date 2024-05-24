"use client";
import React from "react";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import Select from "@/components/Select";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Searchbar from "@/components/Searchbar";
import ContentCard from "@/components/ContentCard";
import Table from "@/components/Table";
import HomePage from "./Home";

export function Home() {
  const data = [
    {
      name: "MEL",
      experiments: 47,
      factors: 37,
      description: "Hep G2 is a human liver cancer cell line.",
    },
    {
      name: "CH12.LX",
      experiments: 36,
      factors: 35,
      description:
        "K562 cells were the first human immortalised myelogenous leukemia cell line to be established.",
    },
    {
      name: "myocyte",
      experiments: 16,
      factors: 12,
      description:
        "Human embryonic kidney 293 cells, also often referred to as HEK 293, HEK-293, 293 cells, or less precisely as HEK cells, are a specific cell line originally derived from human embryonic kidney cells grown in tissue culture.",
    },
    { name: "C2C12", experiments: 5, factors: 5, description: "" },
    { name: "liver", experiments: 7, factors: 4, description: "" },
    {
      name: "MEL",
      experiments: 47,
      factors: 37,
      description: "Hep G2 is a human liver cancer cell line.",
    },
  ];

  const columns = ["name", "experiments", "factors", "description"];

  return (
    <div style={{ background: "#f5f5f5" }}>
      <Topbar />
      <HomePage />

      <br />
      <br />
      <br />
      <main>
        <div className="container">
          <Table data={data} columns={columns} />
        </div>

        <ContentCard
          title={"Akshay Kalapgar"}
          count={222}
          description={"Hi I am Akshay"}
        />

        <Select />
        <Searchbar
          placeholder="Enter search query"
          helperText="Type your search query"
        />
        <Container />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
