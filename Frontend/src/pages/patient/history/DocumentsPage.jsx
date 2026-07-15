import { useEffect, useMemo, useState } from 'react';
import { FileStack, Download, FileText, Image, File } from 'lucide-react';
import { useAuth } from '../../../app/providers/AuthContext';
import { useTimelineSearch } from '../../../context/TimelineSearchContext';
import { getDocuments } from '../../../api/documents.api';
import EmptyState from '../../../components/shared/EmptyState';
import ErrorAlert from '../../../components/shared/ErrorAlert';

function getIcon(type) {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'image':
      return Image;
    default:
      return File;
  }
}

export default function DocumentsPage() {
  const { patientId } = useAuth();
  const { searchTerm } = useTimelineSearch();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDocuments() {
      try {
        setLoading(true);
        setError('');

        if (!patientId) {
          setError('Unable to load documents. Missing patient profile.');
          setDocuments([]);
          return;
        }

        const data = await getDocuments(patientId);

        if (mounted) {
          setDocuments(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError?.message || 'Unable to load documents.');
          setDocuments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDocuments();

    return () => {
      mounted = false;
    };
  }, [patientId]);

  const filtered = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();

    return documents.filter(doc => {
      if (q && !doc.title?.toLowerCase().includes(q)) {
        return false;
      }

      return true;
    });
  }, [documents, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center rounded-xl border bg-white py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorAlert message={error} />}
      <h2 className="text-2xl font-semibold text-slate-900">Documents</h2>
      <div className="grid gap-4">
        {filtered.map(doc => {
          const Icon = getIcon(doc.type);

          return (
            <div
              key={doc.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-slate-900">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {doc.fileUrl && (
                <a
                  href={doc.fileUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Download size={16} />
                  Download
                </a>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <EmptyState
            icon={FileStack}
            title="No Documents Found"
            description="No documents match your current search."
          />
        )}
      </div>
    </div>
  );
}
