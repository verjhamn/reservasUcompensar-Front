/* eslint-disable react/prop-types */
import { Toaster } from 'react-hot-toast';

import ExternalQuoteForm from './ExternalQuoteForm';
import InternalRequestForm from './InternalRequestForm';
import RequestSummary from './RequestSummary';

const QuoteForm = ({
    spaceData,
    quoteData,
    onBack,
    onSuccess,
    requestMode = 'external'
}) => {
    if (requestMode === 'external') {
        return (
            <ExternalQuoteForm
                spaceData={spaceData}
                quoteData={quoteData}
                onBack={onBack}
                onSuccess={onSuccess}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-white animate-fade-in relative z-10 w-full max-w-5xl mx-auto rounded-xl">
            <Toaster />
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 overflow-hidden min-h-0">
                <RequestSummary spaceData={spaceData} quoteData={quoteData} />
                <InternalRequestForm
                    spaceData={spaceData}
                    quoteData={quoteData}
                    onBack={onBack}
                    onSuccess={onSuccess}
                />
            </div>
        </div>
    );
};

export default QuoteForm;
