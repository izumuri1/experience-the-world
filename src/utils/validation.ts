/**
 * バリデーションユーティリティ
 * アプリ全体で使用する入力バリデーション関数
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * メールアドレスのバリデーション
 * @param email メールアドレス
 * @returns バリデーション結果
 */
export function validateEmail(email: string): ValidationResult {
  // 空文字チェック
  if (!email.trim()) {
    return {
      isValid: false,
      error: 'メールアドレスを入力してください',
    };
  }

  // フォーマットチェック（RFC 5322準拠の簡易版）
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: '有効なメールアドレスを入力してください',
    };
  }

  return { isValid: true };
}

/**
 * パスワードのバリデーション
 * @param password パスワード
 * @param minLength 最小文字数（デフォルト: 6）
 * @returns バリデーション結果
 */
export function validatePassword(password: string, minLength: number = 6): ValidationResult {
  // 空文字チェック
  if (!password) {
    return {
      isValid: false,
      error: 'パスワードを入力してください',
    };
  }

  // 最小文字数チェック
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `パスワードは${minLength}文字以上にしてください`,
    };
  }

  return { isValid: true };
}

/**
 * パスワード確認のバリデーション
 * @param password パスワード
 * @param confirmPassword 確認用パスワード
 * @returns バリデーション結果
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'パスワードが一致しません',
    };
  }

  return { isValid: true };
}

/**
 * 必須フィールドのバリデーション
 * @param value 入力値
 * @param fieldName フィールド名
 * @returns バリデーション結果
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value.trim()) {
    return {
      isValid: false,
      error: `${fieldName}を入力してください`,
    };
  }

  return { isValid: true };
}
