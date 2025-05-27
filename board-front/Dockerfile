# 로컬에서 빌드된 파일만 사용
FROM nginx:alpine

# React에서 빌드된 결과물을 복사
COPY build /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 오픈
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]