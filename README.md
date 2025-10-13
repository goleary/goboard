# Photos

`photos.json` is produced using this command:

```
aws s3api list-objects-v2 \
  --bucket goleary-media \
  --endpoint-url=https://136eeb38c591adc8cbaaa1f5c3d156f7.r2.cloudflarestorage.com \
  --profile r2 \
  --query "Contents[].Key" \
  --output json > photos.json
```
