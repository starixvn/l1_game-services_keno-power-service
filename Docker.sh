docker image build --tag keno-power/local:latest -f Dockerfile .
docker run -p 8089:8089 -d keno-power/local:latest
