import React, { useState, useEffect } from 'react';
import { getContentByType } from '../utils/cms.js';

const PortfolioProjects = ({ renderProjects }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const portfolioProjects = await getContentByType('portfolio');
        setProjects(portfolioProjects || []);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.log('CMS not connected, using empty projects');
        }
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-slate-400">
          <i data-lucide="loader-2" className="w-8 h-8 mx-auto mb-4 animate-spin"></i>
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return renderProjects(projects);
};

export default PortfolioProjects;
