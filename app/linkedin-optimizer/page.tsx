"use client";

import React, { useState, useRef, useEffect} from 'react';
import { LinkedInSection } from "@/components/linkedin/LinkedInSection";
import { resumeService } from "@/services/resumeService";

import {
  DocumentArrowUpIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useResumes } from "@/hooks/useResumes";

export default function LinkedInOptimizerPage() {
  const { user } = useAuth();

  const { 
    resumes, 
    isLoading, 
    uploadResume, 
    uploadLoading 
  } = useResumes(user?.uid);

  // State to store the selected resume ID
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null); // Store suggestions as an array
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false); // State for loader

  const handleResumeClick = (resumeId: string) => {
    setSelectedResumeId(resumeId);
  };

  const handleGetLinkedInSuggestions = async () => {
    if (selectedResumeId) {
      setLoadingSuggestions(true); // Show loader
      try {
        const suggestions = await resumeService.getLinkedInSuggestions(user?.uid || '', selectedResumeId);
        setSuggestions(JSON.parse(suggestions.data).About); // Store fetched suggestions
        console.log('LinkedIn suggestions:', suggestions);
      } catch (error) {
        console.error('Error fetching LinkedIn suggestions:', error);
        alert('Failed to fetch LinkedIn suggestions. Please try again.');
      } finally {
        setLoadingSuggestions(false); // Hide loader
      }
    } else {
      alert('Please select a resume to get LinkedIn suggestions.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Select a resume</h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading your resumes...</p>
          </div>
        ) : resumes.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map((resume) => (
                <div
                  key={resume.cloudPath}
                  onClick={() => {
                    if (resume.cloudPath) {
                      handleResumeClick(resume.cloudPath); // Only call if cloudPath is defined
                    } else {
                      console.error("cloudPath is undefined for this resume.");
                    }
                  }}
                  className={`flex items-center justify-between p-2 bg-slate-50 rounded-lg border ${
                    selectedResumeId === resume.cloudPath
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  } cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                    <div className="truncate max-w-[150px]">
                      <p className="font-medium text-slate-800 truncate">{resume.name}</p>
                      <p className="text-sm text-slate-500 truncate">
                        Last modified: {resume.lastModified}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {resume.url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-600 hover:bg-slate-100"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the parent click
                          window.open(resume.url, "_blank");
                        }}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>
              {user
                ? "No resumes found. Upload or create a new resume to get started."
                : "Please sign in to view your resumes."}
            </p>
          </div>
        )}
      </div>

      {/* "Get LinkedIn Suggestions" Button */}
      <div className="text-center mb-8">
        <Button
          variant="default"
          size="lg"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={handleGetLinkedInSuggestions}
        >
          Get LinkedIn Suggestions
        </Button>
      </div>

      {/* Suggestions or Key Points */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-6xl mx-auto">
        {loadingSuggestions ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Fetching LinkedIn suggestions...</p>
          </div>
        ) : suggestions ? (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-800">About Section</h3>
            <p className="text-slate-700 mb-6">{suggestions}</p> {/* Display the string directly */}

            {/* Additional Suggestions */}
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Additional Suggestions</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Use a professional photo – High-quality headshot with a clean background.</li>
              <li>
                Write a strong headline – Go beyond just your job title. Show your value (e.g., 
                “Product Manager | Driving Growth through Data-Driven Strategy”).
              </li>
              <li>
                Craft a compelling summary – Tell your story: who you are, what you do, and what drives you.
              </li>
              <li>
                Highlight achievements in your experience section – Use bullet points, quantify impact 
                (e.g., “Increased sales by 30% in 6 months”).
              </li>
              <li>
                Add relevant skills – Keep it focused and up-to-date; LinkedIn uses these for search rankings.
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-slate-800">Key Points</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Optimize your LinkedIn profile for better visibility.</li>
              <li>Highlight your key skills and achievements.</li>
              <li>Ensure your profile photo is professional.</li>
              <li>Write a compelling LinkedIn summary.</li>
              <li>Use relevant keywords in your profile.</li>
              <li>Request recommendations from colleagues.</li>
              <li>Keep your work experience up to date.</li>
              <li>Engage with posts and share industry insights.</li>
              <li>Join LinkedIn groups relevant to your field.</li>
              <li>Customize your LinkedIn URL for easy sharing.</li>
              <li>Showcase certifications and courses completed.</li>
              <li>Track your profile views and adjust accordingly.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}