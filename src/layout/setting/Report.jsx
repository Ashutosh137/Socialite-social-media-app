import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Input, TextInput } from "../../ui/input";
import Button from "../../ui/button";
import Card from "../../ui/card";

function Report() {
  const [reportitle, setreportitle] = useState("");
  const [report, setreport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (reportitle.trim() === "") {
      toast.error("Please enter a report title");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(`Report submitted successfully: ${reportitle}`);
      setreport("");
      setreportitle("");
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <section className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Report a Problem
      </h1>

      <Card variant="elevated" padding="lg" className="w-full">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            type="text"
            name="reportTitle"
            label="Report Title"
            placeholder="Enter report title"
            value={reportitle}
            onChange={(e) => setreportitle(e.target.value)}
            autoFocus
            required
          />

          <TextInput
            name="report"
            label="Describe Your Problem"
            placeholder="Describe your problem in detail..."
            value={report}
            onChange={(e) => setreport(e.target.value)}
            rows={5}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            disabled={isSubmitting || !reportitle.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </Card>
    </section>
  );
}

export default Report;
