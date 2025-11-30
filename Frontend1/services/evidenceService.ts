import apiClient from '../config/apiClient';
import type { EvidenceDocument } from '../types';

const normalizeEvidence = (payload: any): EvidenceDocument => ({
  id: payload.document_id || payload.id,
  name: payload.file_name,
  type: payload.mime_type,
  size: payload.file_size_bytes,
  url: payload.file_url || payload.storage_path,
  uploadedAt: payload.uploaded_at,
  caseId: payload.case,
});

const getDocuments = async (caseId?: string): Promise<EvidenceDocument[]> => {
  try {
    const response = await apiClient.get('/evidence-documents/', {
      params: caseId ? { case: caseId } : undefined,
    });
    const payload = Array.isArray(response.data) ? response.data : response.data.results || [];
    return payload.map(normalizeEvidence);
  } catch (error) {
    console.error('Get documents error:', error);
    return [];
  }
};

const uploadDocument = async (file: File, caseId: string): Promise<EvidenceDocument> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('case', caseId);

  const response = await apiClient.post('/evidence-documents/', formData);
  return normalizeEvidence(response.data);
};

const deleteDocument = async (documentId: string): Promise<void> => {
  await apiClient.delete(`/evidence-documents/${documentId}/`);
};

export const evidenceService = {
  getDocuments,
  uploadDocument,
  deleteDocument,
};
