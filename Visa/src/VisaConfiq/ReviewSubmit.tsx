import React from 'react';
import { FaArrowLeft, FaCheck, FaGlobe, FaFileAlt, FaImages, FaTimesCircle } from 'react-icons/fa';
interface ImageData {
  preview: string;
  file: File;
}
interface ReviewSubmitProps {
  config: {
    continent: string;
    countryDetails: {
      name: string;
      code: string;
      embassyLocation: string;
      generalRequirements: string;
    };
    visaTypes: unknown[];
    documents: unknown[];
    eligibility: string;
    rejectionReasons: unknown[];
  images: ImageData[];  //
  };
  prevStep: () => void;
  onSubmit: () => void;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ config, prevStep, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Review & Submit</h2>
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaGlobe className="text-blue-500 mr-2" />
          <h3 className="text-xl font-medium">Country Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-medium">{config.countryDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country Code</p>
            <p className="font-medium">{config.countryDetails.code || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Embassy Location</p>
            <p className="font-medium">{config.countryDetails.embassyLocation || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Continent</p>
            <p className="font-medium">{config.continent}</p>
          </div>
        </div>
        {config.countryDetails.generalRequirements && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">General Requirements</p>
            <p className="whitespace-pre-line">{config.countryDetails.generalRequirements}</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaFileAlt className="text-blue-500 mr-2" />
          <h3 className="text-xl font-medium">Visa Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Visa Types</p>
            <p className="text-2xl font-bold">{config.visaTypes.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Documents</p>
            <p className="text-2xl font-bold">{config.documents.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Rejection Reasons</p>
            <p className="text-2xl font-bold">{config.rejectionReasons.length}</p>
          </div>
        </div>

        {config.eligibility && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Eligibility Criteria</p>
            <p className="whitespace-pre-line">{config.eligibility}</p>
          </div>
        )}
      </div>

       {config.images.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaImages className="text-blue-500 mr-2" />
            <h3 className="text-xl font-medium">Uploaded Images</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {config.images.map((img, index) => (
              <img 
                key={index} 
                src={img.preview}  // Changed from img to img.preview
                alt={`Preview ${index + 1}`} 
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="space-x-4">
          <button
            type="button"
            className="flex items-center px-6 py-3 bg-red-100 text-red-700 rounded-lg"
          >
            <FaTimesCircle className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheck className="mr-2" /> Submit Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;