/**
 * 位置情報取得サービス
 * expo-locationを使用して現在位置・住所・国コードを取得
 */

import * as Location from 'expo-location';

class LocationService {
  /**
   * 位置情報パーミッションをリクエスト
   */
  async appRequestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  /**
   * 現在位置を取得
   */
  async appGetCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
  }> {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }

  /**
   * 逆ジオコーディング（緯度経度から住所を取得）
   */
  async appReverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{
    address: string;
    placeName: string;
    countryCode: string;
  }> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length === 0) {
        return {
          address: '',
          placeName: '',
          countryCode: '',
        };
      }

      const result = results[0];

      // 住所を構築
      const addressParts = [
        result.city,
        result.district,
        result.street,
        result.name,
      ].filter(Boolean);

      const address = addressParts.join(', ');

      // 場所名（最も具体的な名称を優先）
      const placeName = result.name || result.street || result.city || '';

      // 国コード（ISO 3166-1 alpha-2）
      const countryCode = result.isoCountryCode || '';

      return {
        address,
        placeName,
        countryCode,
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return {
        address: '',
        placeName: '',
        countryCode: '',
      };
    }
  }

  /**
   * 位置情報と住所を一度に取得（便利メソッド）
   */
  async appGetLocationWithAddress(): Promise<{
    latitude: number;
    longitude: number;
    address: string;
    placeName: string;
    countryCode: string;
  }> {
    // 位置情報取得
    const { latitude, longitude } = await this.appGetCurrentLocation();

    // 逆ジオコーディング
    const { address, placeName, countryCode } = await this.appReverseGeocode(
      latitude,
      longitude
    );

    return {
      latitude,
      longitude,
      address,
      placeName,
      countryCode,
    };
  }
}

// シングルトンインスタンス
export const locationService = new LocationService();
