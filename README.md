# POPBLE

# **순서 꼭 지키세요!!**

##GitHub 관련
-------------
작업 시작할 때 pull, push전에도 pull 후 push&commit

### 0. git bash 사용시 POPBLE 폴더 까지 이동
cd POPBLE상위폴더/POPBLE

### 1. main 최신화
git checkout main
git pull origin main     # 원격 저장소에서 최신 main 가져오기

### 2. 작업 브랜치로 이동
git checkout [본인_브랜치명]
git merge main           # 최신 main 내용을 내 브랜치에 반영

### 3. 코드 작성

### 4. 변경사항 커밋
git add .                # 로컬에있는 변경 내용 추가
git commit -m "작업 내용" # 버전 반영

### 5. push 전에 다시 한 번 최신화
git pull origin main     # 혹시라도 main에 또 다른 변경이 생겼을 경우 대비
git merge main           # 내 브랜치에 반영

### 6. 문제 없으면 푸시
git push origin [본인_브랜치명] # 원격 저장소에 반영


##가짜데이터 관련
---------------
src/test/java에 테스트 데이터 넣었습니다.

UsersDummy-> UserProfileDummy

PopupStoreDummy -> CategoryDummy -> PopupCategoryDummy

# **순서 꼭 지키세요!!**
