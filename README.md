# Logo Kaldırma Uygulaması

Bu uygulama, fotoğraflardan logo ve markaları otomatik olarak kaldırmak için tasarlanmış bir araçtır.

## Özellikler

- Basit ve kullanıcı dostu arayüz
- Çoklu görüntü formatı desteği (PNG, JPG, JPEG, BMP, GIF, TIFF)
- Gerçek zamanlı önizleme
- Kolay kaydetme seçenekleri

## Kurulum

1. Gerekli Python paketlerini yükleyin:
```bash
pip install -r requirements.txt
```

2. Uygulamayı çalıştırın:
```bash
python logo_remover.py
```

## Kullanım

1. "Fotoğraf Seç" butonuna tıklayarak bir görüntü seçin
2. "Logoyu Kaldır" butonuna tıklayarak işlemi başlatın
3. İşlem tamamlandığında "Kaydet" butonu ile sonucu kaydedin

## Gereksinimler

- Python 3.7+
- OpenCV
- NumPy
- Pillow
- rembg
- tkinter 