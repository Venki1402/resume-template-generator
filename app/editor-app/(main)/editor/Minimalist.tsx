import { memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useResume } from "./forms/ResumeProvider";
import { Phone, Mail, Linkedin, Github, ExternalLink } from "lucide-react";
import { formatDate } from "date-fns/format";
import DOMPurify from "dompurify";
import useDimensions from "@/hooks/useDimensions";
import { ResumeValues } from "@/lib/validation";

interface MinimalistResumePreviewProps {
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

export default function MinimalistResumePreview({
  className,
  contentRef,
}: MinimalistResumePreviewProps) {
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
        "bg-white text-black h-fit w-full aspect-[210/297] shadow-lg font-comic",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("p-8", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader personalInfo={resumeData?.personalInfo} />
        <div className="mt-6 space-y-5">
          <WorkExperienceSection
            workExperiences={filteredData?.workExperiences}
          />
          <EducationSection education={filteredData?.education} />
          <ProjectsSection projects={filteredData?.projects} />
          <SkillsSection skills={resumeData?.skills} />
          <LanguagesSection languages={resumeData?.languages} />
          <VolunteerSection volunteer={resumeData?.volunteer} />
          <InterestsSection interests={resumeData?.interests} />
          <AwardsSection awards={resumeData?.awards} />
          <ReferencesSection references={resumeData?.references} />
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
    <div className="text-center border-b border-gray-200 pb-4">
      <h1 className="text-2xl font-normal tracking-wide uppercase mb-2">
        {firstname} {lastname}
      </h1>

      <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
        {(city || country) && (
          <span className="flex items-center">
            {city}
            {city && country ? ", " : ""}
            {country}
          </span>
        )}

        {phone && (
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {phone}
          </span>
        )}

        {email && (
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {email}
          </span>
        )}

        {linkedin && (
          <span className="flex items-center gap-1">
            <Linkedin className="w-3 h-3" />
            {linkedin}
          </span>
        )}

        {github && (
          <span className="flex items-center gap-1">
            <Github className="w-3 h-3" />
            {github}
          </span>
        )}
      </div>

      {summary && (
        <div className="mt-3 text-sm text-left">
          <p className="whitespace-pre-line">{summary}</p>
        </div>
      )}
    </div>
  );
});

const WorkExperienceSection = memo(
  ({ workExperiences }: ResumeSectionProps) => {
    if (!workExperiences?.length) return null;

    return (
      <div>
        <h2 className="text-md font-normal uppercase tracking-wider mb-2">
          Experience
        </h2>
        <div className="space-y-3">
          {workExperiences.map((exp, index) => (
            <div key={index} className="text-sm">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{exp.position}</span>
                  {exp.name && (
                    <span className="text-gray-600"> at {exp.name}</span>
                  )}
                </div>
                {exp.startDate && (
                  <span className="text-gray-500 text-xs">
                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MM/yyyy")
                      : "Present"}
                  </span>
                )}
              </div>

              {(exp.city || exp.country) && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {exp.city}
                  {exp.city && exp.country ? ", " : ""}
                  {exp.country}
                </div>
              )}

              {exp.description && (
                <div
                  className="mt-1 text-xs"
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
      <h2 className="text-md font-normal uppercase tracking-wider mb-2">
        Education
      </h2>
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between">
              <div>
                <span className="font-medium">{edu.institution}</span>
                {edu.studyType && (
                  <span className="text-gray-600"> - {edu.studyType}</span>
                )}
              </div>
              {edu.startDate && (
                <span className="text-gray-500 text-xs">
                  {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                  {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>

            {edu.area && (
              <div className="text-xs text-gray-500 mt-0.5">{edu.area}</div>
            )}

            {edu.score && (
              <div className="text-xs text-gray-500 mt-0.5">
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
      <h2 className="text-md font-normal uppercase tracking-wider mb-2">
        Projects
      </h2>
      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between">
              <span className="font-medium">{project.title}</span>
              {project.startDate && (
                <span className="text-gray-500 text-xs">
                  {formatDate(project.startDate, "MM/yyyy")} -{" "}
                  {project.endDate
                    ? formatDate(project.endDate, "MM/yyyy")
                    : "Present"}
                </span>
              )}
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 flex items-center gap-1 mt-0.5"
              >
                {project.link} <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.description && (
              <div
                className="mt-1 text-xs"
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
      <h2 className="text-md font-normal uppercase tracking-wider mb-2">
        {title}
      </h2>
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
