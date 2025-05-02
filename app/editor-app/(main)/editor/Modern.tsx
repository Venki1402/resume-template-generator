import { memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useResume } from "./forms/ResumeProvider";
import {
  Phone,
  Mail,
  Linkedin,
  Github,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react";
import { formatDate } from "date-fns/format";
import DOMPurify from "dompurify";
import useDimensions from "@/hooks/useDimensions";
import { ResumeValues } from "@/lib/validation";

interface ModernResumePreviewProps {
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface ResumeSectionProps {
  personalInfo?: ResumeValues["personalInfo"];
  workExperiences?: ResumeValues["workExperiences"];
  education?: ResumeValues["education"];
  projects?: ResumeValues["projects"];
  skills?: ResumeValues["skills"];
  languages?: ResumeValues["languages"];
  volunteer?: ResumeValues["volunteer"];
  interests?: ResumeValues["interests"];
  awards?: ResumeValues["awards"];
  references?: ResumeValues["references"];
}

interface GenericSectionProps {
  title: string;
  data?: { description?: string; description_text?: string };
}

export default function ModernResumePreview({
  className,
  contentRef,
}: ModernResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
  const { resumeData } = useResume();

  const filteredData = useMemo(
    () => ({
      workExperiences: resumeData?.workExperiences?.filter((exp) =>
        Object.values(exp).some(Boolean)
      ),
      education: resumeData?.education?.filter((edu) =>
        Object.values(edu).some(Boolean)
      ),
      projects: resumeData?.projects?.filter((project) =>
        Object.values(project).some(Boolean)
      ),
    }),
    [resumeData]
  );

  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297] shadow-lg font-jetbrains",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("p-0", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader personalInfo={resumeData?.personalInfo} />

        <div className="px-8 py-6 space-y-6">
          <WorkExperienceSection
            workExperiences={filteredData?.workExperiences}
          />
          <div className="grid grid-cols-2 gap-6">
            <div>
              <EducationSection education={filteredData?.education} />
              <div className="mt-6">
                <SkillsSection skills={resumeData?.skills} />
              </div>
              <div className="mt-6">
                <LanguagesSection languages={resumeData?.languages} />
              </div>
            </div>
            <div>
              <ProjectsSection projects={filteredData?.projects} />
              <div className="mt-6">
                <VolunteerSection volunteer={resumeData?.volunteer} />
              </div>
              <div className="mt-6">
                <InterestsSection interests={resumeData?.interests} />
              </div>
              <div className="mt-6">
                <AwardsSection awards={resumeData?.awards} />
              </div>
              <div className="mt-6">
                <ReferencesSection references={resumeData?.references} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PersonalInfoHeader = memo(({ personalInfo }: ResumeSectionProps) => {
  const { firstname, lastname, email, phone, socials, city, country, summary } =
    personalInfo || {};
  const { linkedin, github } = socials || {};

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-6">
      <h1 className="text-3xl font-bold mb-1">
        {firstname} {lastname}
      </h1>

      <div className="flex flex-wrap gap-4 text-sm mb-4">
        {(city || country) && (
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {city}
            {city && country ? ", " : ""}
            {country}
          </span>
        )}

        {phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            {phone}
          </span>
        )}

        {email && (
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {email}
          </span>
        )}

        {linkedin && (
          <span className="flex items-center gap-1">
            <Linkedin className="w-4 h-4" />
            {linkedin}
          </span>
        )}

        {github && (
          <span className="flex items-center gap-1">
            <Github className="w-4 h-4" />
            {github}
          </span>
        )}
      </div>

      {summary && (
        <div className="text-sm text-blue-100">
          <p className="whitespace-pre-line">{summary}</p>
        </div>
      )}
    </div>
  );
});

const SectionTitle = memo(({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-1 mb-3">
    {children}
  </h2>
));

const WorkExperienceSection = memo(
  ({ workExperiences }: ResumeSectionProps) => {
    if (!workExperiences?.length) return null;

    return (
      <div>
        <SectionTitle>Professional Experience</SectionTitle>
        <div className="space-y-4">
          {workExperiences.map((exp, index) => (
            <div
              key={index}
              className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-2 before:h-2 before:bg-blue-500 before:rounded-full"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{exp.position}</h3>
                  <p className="text-sm text-gray-600">{exp.name}</p>
                </div>
                {exp.startDate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MM/yyyy")
                      : "Present"}
                  </div>
                )}
              </div>

              {(exp.city || exp.country) && (
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {exp.city}
                  {exp.city && exp.country ? ", " : ""}
                  {exp.country}
                </div>
              )}

              {exp.description && (
                <div
                  className="mt-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(exp.description),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const EducationSection = memo(({ education }: ResumeSectionProps) => {
  if (!education?.length) return null;

  return (
    <div>
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={index} className="text-sm">
            <div className="font-medium">{edu.institution}</div>
            <div className="text-gray-600">
              {edu.studyType}
              {edu.area ? ` - ${edu.area}` : ""}
            </div>

            {edu.startDate && (
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
              </div>
            )}

            {edu.score && (
              <div className="text-xs text-gray-600 mt-1">
                Score: {edu.score}
              </div>
            )}

            {edu.courses && (
              <div
                className="mt-1 text-xs"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(edu.courses),
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const ProjectsSection = memo(({ projects }: ResumeSectionProps) => {
  if (!projects?.length) return null;

  return (
    <div>
      <SectionTitle>Projects</SectionTitle>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={index} className="text-sm">
            <div className="font-medium">{project.title}</div>

            {project.startDate && (
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(project.startDate, "MM/yyyy")} -{" "}
                {project.endDate
                  ? formatDate(project.endDate, "MM/yyyy")
                  : "Present"}
              </div>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 flex items-center gap-1 mt-1"
              >
                {project.link} <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.description && (
              <div
                className="mt-1 text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(project.description),
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const GenericSection = memo(({ title, data }: GenericSectionProps) => {
  if (!data?.description) return null;

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(data.description),
        }}
      />
    </div>
  );
});

const SkillsSection = memo(({ skills }: ResumeSectionProps) => {
  return <GenericSection title="Skills" data={skills} />;
});

const LanguagesSection = memo(({ languages }: ResumeSectionProps) => {
  return <GenericSection title="Languages" data={languages} />;
});

const VolunteerSection = memo(({ volunteer }: ResumeSectionProps) => {
  return <GenericSection title="Volunteer Experience" data={volunteer} />;
});

const InterestsSection = memo(({ interests }: ResumeSectionProps) => {
  return <GenericSection title="Interests" data={interests} />;
});

const AwardsSection = memo(({ awards }: ResumeSectionProps) => {
  return <GenericSection title="Awards" data={awards} />;
});

const ReferencesSection = memo(({ references }: ResumeSectionProps) => {
  return <GenericSection title="References" data={references} />;
});
