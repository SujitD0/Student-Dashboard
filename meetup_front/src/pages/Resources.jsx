import React from 'react';
import { BookOpen, Globe, Lightbulb, GraduationCap, FileText, Wrench, ExternalLink } from 'lucide-react';

const resourceCategories = [
    {
        title: 'Study Guides',
        icon: <BookOpen className="w-6 h-6" />,
        description: 'Comprehensive study materials and guides to help you excel.',
        resources: [
            { name: 'Khan Academy', url: 'https://www.khanacademy.org', desc: 'Free courses in math, science, and more' },
            { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', desc: 'Free lecture notes, exams, and videos from MIT' },
            { name: 'Coursera', url: 'https://www.coursera.org', desc: 'Online courses from top universities' },
            { name: 'edX', url: 'https://www.edx.org', desc: 'Free online courses from Harvard, MIT, and more' },
        ]
    },
    {
        title: 'Academic Tools',
        icon: <Wrench className="w-6 h-6" />,
        description: 'Essential tools for academic success and productivity.',
        resources: [
            { name: 'Google Scholar', url: 'https://scholar.google.com', desc: 'Search scholarly literature across disciplines' },
            { name: 'Zotero', url: 'https://www.zotero.org', desc: 'Free tool to collect, organize, and cite research' },
            { name: 'Wolfram Alpha', url: 'https://www.wolframalpha.com', desc: 'Computational knowledge engine for math and science' },
            { name: 'Grammarly', url: 'https://www.grammarly.com', desc: 'AI-powered writing assistance' },
        ]
    },
    {
        title: 'Productivity Tips',
        icon: <Lightbulb className="w-6 h-6" />,
        description: 'Methods and techniques to boost your learning efficiency.',
        resources: [
            { name: 'Pomodoro Technique', url: 'https://en.wikipedia.org/wiki/Pomodoro_Technique', desc: 'Time management method for focused study sessions' },
            { name: 'Notion', url: 'https://www.notion.so', desc: 'All-in-one workspace for notes, tasks, and wikis' },
            { name: 'Anki', url: 'https://apps.ankiweb.net', desc: 'Intelligent flashcards for efficient memorization' },
            { name: 'Forest App', url: 'https://www.forestapp.cc', desc: 'Stay focused by planting virtual trees' },
        ]
    },
    {
        title: 'Research Resources',
        icon: <GraduationCap className="w-6 h-6" />,
        description: 'Databases and repositories for research papers and publications.',
        resources: [
            { name: 'arXiv', url: 'https://arxiv.org', desc: 'Open-access archive for scholarly articles' },
            { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov', desc: 'Biomedical literature from MEDLINE and life science journals' },
            { name: 'JSTOR', url: 'https://www.jstor.org', desc: 'Digital library of academic journals, books, and primary sources' },
            { name: 'ResearchGate', url: 'https://www.researchgate.net', desc: 'Professional network for scientists and researchers' },
        ]
    },
];

const Resources = () => {
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-4xl font-black mb-2 border-b-4 border-black inline-block">
                RESOURCES
            </h1>
            <p className="text-gray-600 mt-2 mb-8">
                Curated learning materials, tools, and references to support your academic journey.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resourceCategories.map((category, idx) => (
                    <div key={idx} className="card">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-black text-white">
                                {category.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{category.title}</h2>
                                <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {category.resources.map((resource, rIdx) => (
                                <a
                                    key={rIdx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 border-2 border-gray-200 hover:border-black hover:-translate-y-0.5 hover:shadow-hard transition-all duration-200 group"
                                >
                                    <div className="flex-1">
                                        <div className="font-bold flex items-center gap-2">
                                            {resource.name}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <p className="text-sm text-gray-600">{resource.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Tips Section */}
            <div className="mt-12 border-4 border-black p-8 bg-black text-white">
                <h2 className="text-2xl font-black mb-4">💡 Quick Study Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-2 border-white p-4">
                        <h3 className="font-bold text-lg mb-2">Active Recall</h3>
                        <p className="text-sm text-gray-300">Test yourself on material instead of just re‑reading notes. This strengthens memory more effectively.</p>
                    </div>
                    <div className="border-2 border-white p-4">
                        <h3 className="font-bold text-lg mb-2">Spaced Repetition</h3>
                        <p className="text-sm text-gray-300">Review material at increasing intervals to move information into long-term memory.</p>
                    </div>
                    <div className="border-2 border-white p-4">
                        <h3 className="font-bold text-lg mb-2">Feynman Technique</h3>
                        <p className="text-sm text-gray-300">Explain concepts in simple language. If you can't, identify gaps and study those areas.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
