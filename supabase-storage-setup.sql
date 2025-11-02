-- ============================================
-- Supabase Storage バケットとポリシーの設定
-- ============================================

-- 1. mediaバケットの作成 (ダッシュボードで手動作成が必要)
-- バケット名: media
-- Public: false (プライベート)

-- 2. Storageポリシー: アップロード権限
CREATE POLICY "Users can upload own media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Storageポリシー: 読み取り権限
CREATE POLICY "Users can read own media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Storageポリシー: 削除権限
CREATE POLICY "Users can delete own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- Storage設定完了
-- ============================================
