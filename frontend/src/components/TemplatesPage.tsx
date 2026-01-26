import { useState } from 'react';
import { templates, getAllCategories, type Template } from '../data/templates';
import { Search, Filter, Sparkles, ArrowLeft } from 'lucide-react';

interface Props {
    onSelectTemplate: (template: Template) => void;
    onBack: () => void;
}

export default function TemplatesPage({ onSelectTemplate, onBack }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    const categories = ['All', ...getAllCategories()];

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-navy-900 font-display">Presentation Templates</h1>
                                <p className="text-gray-500 mt-1">Choose a professional template to get started</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <Sparkles size={16} className="text-amber-600" />
                            <span className="text-sm font-semibold text-amber-900">{templates.length} Templates Available</span>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="outline-none bg-transparent font-medium text-gray-700 cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            {/* Templates Grid */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No templates found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onSelect={() => onSelectTemplate(template)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect: () => void }) {
    return (
        <div
            onClick={onSelect}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
            {/* Template Preview */}
            <div
                className="h-48 relative flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: template.primaryColor }}
            >
                {/* Decorative Elements */}
                <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30"
                    style={{ backgroundColor: template.accentColor }}
                />
                <div
                    className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: template.accentColor }}
                />

                {/* Template Icon */}
                <div className="relative z-10 text-7xl group-hover:scale-110 transition-transform duration-300">
                    {template.thumbnail}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 px-6 py-2 bg-white text-navy-900 font-bold rounded-lg shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                        Use Template
                    </button>
                </div>
            </div>

            {/* Template Info */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-navy-900 text-lg">{template.name}</h3>
                    <span className="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-600 rounded-full">
                        {template.category}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                {/* Color Palette */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Colors:</span>
                    <div className="flex gap-1.5">
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: template.primaryColor }}
                            title="Primary Color"
                        />
                        <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: template.accentColor }}
                            title="Accent Color"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
