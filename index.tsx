import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function LegalBotApp() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResponse(data.summary || "Nie udało się przetworzyć pliku.");
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
    setResponse(data.response || "Brak odpowiedzi.");
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold">Bot Prawniczy</h1>

      <Card>
        <CardContent className="space-y-2 p-4">
          <label className="font-medium">Załaduj orzeczenie (PDF/DOCX):</label>
          <Input type="file" accept=".pdf,.docx" onChange={handleFileUpload} />
          {fileName && <p className="text-sm text-gray-500">Wczytano: {fileName}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-4">
          <label className="font-medium">Zadaj pytanie lub opisz sprawę:</label>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Np. Wygeneruj pozew o sankcję kredytu darmowego..."
          />
          <Button onClick={handleSubmit}>Wyślij</Button>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <label className="font-medium">Odpowiedź bota:</label>
            <p>{response}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
