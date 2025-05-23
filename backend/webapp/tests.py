import pytest
from fastapi.testclient import TestClient
from webapp.application import create_app


@pytest.fixture(scope="module")
def client():
    app = create_app()
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="module")
def admin_headers(client):
    # 관리자 유저 생성 및 로그인 (이미 존재 시 에러를 무시합니다)
    admin_signup_data = {
        "username": "admin",
        "email": "admin@example.com",
        "password": "adminpass",
        "gender": "male",
        "birth_year": 1990,
        "mbti": "INTJ",
        "keywords": "admin, test",
        "favorite_media": "N/A",
        "tmi": "테스트용 계정",
        "hobby": "coding",
        "strength": "testing",
        "happyMoment": "실패 없는 테스트",
    }
    response = client.post("/auth/signup", json=admin_signup_data)
    # 이미 존재하면 무시하도록 처리
    if response.status_code not in (200, 201):
        pass
    # 로그인 (OAuth2PasswordRequestForm 방식이므로 form data로 전송)
    login_data = {"username": "admin@example.com", "password": "adminpass"}
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200, f"관리자 로그인 실패: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def test_channel(client, admin_headers):
    channel_data = {
        "title": "테스트 채널",
        "description": "테스트용 채널입니다.",
        "event_date": "2025-03-01",
        "brand_id": 3,  # 예시로 존재하는 brand id 사용
        "visible_components": ["REVIEW_FORM", "REVIEW_LIST"],
    }
    response = client.post("/channels", json=channel_data, headers=admin_headers)
    assert response.status_code in (200, 201), f"채널 생성 실패: {response.text}"
    return response.json()


@pytest.fixture(scope="module")
def test_group(client, admin_headers, test_channel):
    # test_channel의 id를 참조하여 그룹 생성
    group_data = {
        "channel_id": test_channel["id"],
        "title": "테스트 그룹",
        "description": "테스트용 그룹입니다.",
    }
    response = client.post("/groups", json=group_data, headers=admin_headers)
    assert response.status_code in (200, 201), f"그룹 생성 실패: {response.text}"
    return response.json()


@pytest.fixture(scope="module")
def test_brand(client, admin_headers):
    brand_data = {
        "name": "테스트 브랜드",
        "description": "테스트용 브랜드입니다.",
    }
    response = client.post("/brands", json=brand_data, headers=admin_headers)
    assert response.status_code in (200, 201), f"브랜드 생성 실패: {response.text}"
    return response.json()


@pytest.fixture(scope="module")
def user_headers(client):
    # 테스트용 사용자 회원가입/로그인 처리
    test_user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpass",
        "gender": "female",
        "birth_year": 1995,
        "mbti": "ENFP",
        "keywords": "tester",
        "favorite_media": "N/A",
        "tmi": "테스트용 사용자",
        "hobby": "reading",
        "strength": "determination",
        "happyMoment": "테스트 성공",
    }
    # 회원가입 요청 (이미 존재하면 무시하는 처리 필요)
    response = client.post("/auth/signup", json=test_user_data)
    if response.status_code not in (200, 201):
        pass  # 이미 가입된 경우
    # 로그인 (form data 전송)
    login_data = {
        "username": test_user_data["email"],
        "password": test_user_data["password"],
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200, f"로그인 실패: {response.text}"
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


# Auth 라우터 테스트
def test_auth_signup_and_login(client):
    # 일반 사용자 회원가입 및 로그인 테스트
    test_user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpass",
        "gender": "female",
        "birth_year": 1995,
        "mbti": "ENFP",
        "keywords": "tester",
        "favorite_media": "N/A",
        "tmi": "테스트용 사용자",
        "hobby": "reading",
        "strength": "determination",
        "happyMoment": "성공적인 테스트",
    }
    # 회원가입 요청
    response = client.post("/auth/signup", json=test_user_data)
    if response.status_code not in (200, 201):
        detail = response.json().get("detail", "")
        if detail == "해당 이메일로 가입된 사용자가 이미 존재합니다.":
            # 이미 가입되어 있는 경우 에러가 아니라 넘어갑니다.
            pass
        else:
            assert response.status_code in (200, 201), f"회원가입 실패: {response.text}"
    else:
        user = response.json()
        assert "id" in user

    # 로그인 테스트
    login_data = {
        "username": test_user_data["email"],
        "password": test_user_data["password"],
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200, f"로그인 실패: {response.text}"
    data = response.json()
    assert "access_token" in data


# User 라우터 (관리자 전용) 테스트
def test_user_router_get_list(client, admin_headers):
    # 관리자 권한으로 /users 목록 조회
    response = client.get("/users", headers=admin_headers, params={"limit": 10})
    assert response.status_code == 200, f"/users 조회 실패: {response.text}"
    data = response.json()
    assert "users" in data
    assert "totalCount" in data


def test_user_router_search(client, admin_headers):
    # 관리자 권한으로 사용자 검색 테스트
    response = client.get(
        "/users/search", headers=admin_headers, params={"name": "testuser"}
    )
    assert response.status_code == 200, f"/users/search 실패: {response.text}"
    data = response.json()
    assert isinstance(data, list)


def test_user_router_get_by_id(client, admin_headers):
    # /users 목록에서 첫 번째 사용자 선택 후 상세 조회
    list_response = client.get("/users", headers=admin_headers, params={"limit": 1})
    assert (
        list_response.status_code == 200
    ), f"/users 목록 조회 실패: {list_response.text}"
    list_data = list_response.json()
    if list_data["users"]:
        user_id = list_data["users"][0]["id"]
        response = client.get(f"/users/{user_id}", headers=admin_headers)
        assert (
            response.status_code == 200
        ), f"/users/{user_id} 조회 실패: {response.text}"


# Customers 라우터 테스트 (현재 사용자 정보, 채널 목록 등)
def test_customers_router_my_info(client, admin_headers):
    # /customers/my_info: 현재 사용자 정보 조회
    response = client.get("/customers/my_info", headers=admin_headers)
    assert response.status_code == 200, f"/customers/my_info 조회 실패: {response.text}"
    data = response.json()
    assert "id" in data
    assert "username" in data


def test_customers_router_update_my_info(client, admin_headers):
    # /customers/my_info 수정 테스트
    update_data = {
        "username": "admin_updated",
        "email": "admin@example.com",
        "password": "adminpass",
        "gender": "male",
        "birth_year": 1990,
        "mbti": "INTJ",
        "keywords": "admin updated",
        "favorite_media": "N/A",
        "tmi": "테스트 수정",
        "hobby": "coding",
        "strength": "leadership",
        "happyMoment": "테스트 성공",
    }
    response = client.put("/customers/my_info", json=update_data, headers=admin_headers)
    assert response.status_code == 200, f"/customers/my_info 수정 실패: {response.text}"
    data = response.json()
    assert data["username"] == "admin_updated"


def test_customers_router_channel_list(client, admin_headers):
    # /customers/channel_list: 채널 목록 조회
    response = client.get("/customers/channel_list", headers=admin_headers)
    assert (
        response.status_code == 200
    ), f"/customers/channel_list 조회 실패: {response.text}"


def test_customers_router_get_my_channels(client, admin_headers):
    # /customers/channels: 가입한 채널 목록 조회
    response = client.get("/customers/channels", headers=admin_headers)
    assert (
        response.status_code == 200
    ), f"/customers/channels 조회 실패: {response.text}"


# Group 라우터 테스트 (Customers 혹은 User 라우터 내 그룹 관련 API)
def test_group_router_get_my_groups(client, admin_headers):
    # /customers/groups: 사용자가 가입한 그룹 조회 (channel_id는 선택적 파라미터)
    response = client.get(
        "/customers/groups", headers=admin_headers, params={"channel_id": 1}
    )
    # 가입 그룹이 없을 경우 빈 리스트를 반환할 수 있음
    assert response.status_code == 200, f"/customers/groups 조회 실패: {response.text}"


# Game 라우터 테스트 (고객용 게임 조회 API)
def test_game_router_get_my_games(client, admin_headers):
    # /customers/games: 사용자의 게임 목록 조회
    response = client.get(
        "/customers/games", headers=admin_headers, params={"channel_id": 1}
    )
    assert response.status_code == 200, f"/customers/games 조회 실패: {response.text}"


def test_game_router_get_my_games_with_matched_user(client, admin_headers):
    # /customers/games/matched_user: 사용자의 매칭 게임 목록 조회 (매칭된 사용자 포함)
    response = client.get(
        "/customers/games/matched_user", headers=admin_headers, params={"channel_id": 1}
    )
    assert (
        response.status_code == 200
    ), f"/customers/games/matched_user 조회 실패: {response.text}"


# Review 라우터 테스트 (관리자 전용)
def test_review_router_search(client, admin_headers):
    # /reviews/search: 채널 기준 리뷰 검색 (target_user_id는 선택적 파라미터)
    response = client.get(
        "/reviews/search", headers=admin_headers, params={"channel_id": 1}
    )
    assert response.status_code == 200, f"/reviews/search 조회 실패: {response.text}"


def test_review_router_create_review(client, admin_headers, test_channel):
    channel_id = test_channel["id"]
    review_data = {
        "target_user_id": 1,
        "reviewer_user_id": 1,
        "channel_id": channel_id,
        "style": "friendly",
        "impression": "좋은 경험",
        "conversation": "자세한 대화 내용",
        "additional_info": "추가 정보",
        "keywords": "키워드",
    }
    response = client.post("/reviews", json=review_data, headers=admin_headers)
    assert response.status_code == 201, f"/reviews 생성 실패: {response.text}"
    data = response.json()
    assert data["target_user_id"] == 1


def test_game_operations(client, admin_headers, test_channel, test_group):
    """
    게임 페어 API에 대해 다음을 테스트합니다.
      - 여러 테스트 사용자 생성 후 채널 가입
      - POST /games/pairs를 통해 다수의 게임 페어 생성
      - GET /games로 전체 게임 목록 조회
      - GET /games/search로 검색 기능 테스트
      - DELETE /games/{game_id}로 게임 삭제 후 상세 조회 시 404 검증
    """

    # 헬퍼 함수: 테스트 사용자를 생성하고 채널에 가입한 후, 사용자 ID와 토큰 헤더 반환
    def create_and_join_user(suffix):
        user_data = {
            "username": f"gameuser{suffix}",
            "email": f"gameuser{suffix}@example.com",
            "password": "testpass",
            "gender": "other",
            "birth_year": 2000,
            "mbti": "INTP",
            "keywords": "game, test",
            "favorite_media": "N/A",
            "tmi": "게임 테스트용 계정",
            "hobby": "gaming",
            "strength": "strategy",
            "happyMoment": "테스트 성공",
        }
        signup_response = client.post("/auth/signup", json=user_data)
        if signup_response.status_code not in (200, 201):
            detail = signup_response.json().get("detail", "")
            if detail == "해당 이메일로 가입된 사용자가 이미 존재합니다.":
                pass
            else:
                assert signup_response.status_code in (
                    200,
                    201,
                ), f"회원가입 실패: {signup_response.text}"
        # 로그인
        login_data = {"username": user_data["email"], "password": user_data["password"]}
        login_response = client.post("/auth/login", data=login_data)
        assert login_response.status_code == 200, f"로그인 실패: {login_response.text}"
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 채널 가입: customers_router에 정의된 POST /customers/channel 엔드포인트 이용
        join_response = client.post(
            "/customers/channel",
            json={"target_channel_id": test_channel["id"]},
            headers=headers,
        )
        assert join_response.status_code in (
            200,
            201,
        ), f"채널 가입 실패: {join_response.text}"

        # 현재 사용자 정보 조회(가입된 사용자 ID 확보)
        info_response = client.get("/customers/my_info", headers=headers)
        assert (
            info_response.status_code == 200
        ), f"내 정보 조회 실패: {info_response.text}"
        user_info = info_response.json()
        return user_info["id"], headers

    # 게임 페어를 형성하기 위한 테스트 사용자 4명 생성 및 채널 가입
    user1_id, user1_headers = create_and_join_user(1)
    user2_id, user2_headers = create_and_join_user(2)
    user3_id, user3_headers = create_and_join_user(3)
    user4_id, user4_headers = create_and_join_user(4)

    # 관리자 권한으로 POST /games/pairs를 이용해 게임 페어 생성
    pair_request_data = {
        "group_id": test_group["id"],
        "pointed_users": [[user1_id, user2_id], [user3_id, user4_id]],
    }
    create_pairs_response = client.post(
        "/games/pairs", json=pair_request_data, headers=admin_headers
    )
    assert (
        create_pairs_response.status_code == 201
    ), f"게임 페어 생성 실패: {create_pairs_response.text}"
    games_created = create_pairs_response.json()
    assert isinstance(games_created, list), "게임 생성 응답이 리스트가 아닙니다."
    assert len(games_created) >= 2, "생성된 게임 페어의 수가 부족합니다."

    # 각 게임에 대해 채널 ID와 페어 정보(양쪽 사용자 ID)가 올바른지 검증
    for game in games_created:
        assert (
            game["group_id"] == test_group["id"]
        ), "게임의 그룹 ID가 일치하지 않습니다."
        assert game.get("user_id") is not None, "게임의 user_id가 없습니다."
        assert (
            game.get("matched_user_id") is not None
        ), "게임의 matched_user_id가 없습니다."

    # 전체 게임 목록 조회 테스트 (GET /games)
    list_response = client.get("/games", headers=admin_headers)
    assert (
        list_response.status_code == 200
    ), f"게임 목록 조회 실패: {list_response.text}"
    all_games = list_response.json()
    created_game_ids = [game["id"] for game in games_created]
    fetched_game_ids = [game["id"] for game in all_games]
    for gid in created_game_ids:
        assert gid in fetched_game_ids, f"게임 ID {gid}가 전체 목록에 없습니다."

    # 게임 검색(탐색) 테스트: 채널 ID 기반으로 게임 목록 검색 (GET /games/search)
    search_response = client.get(
        "/games/search", headers=admin_headers, params={"group_id": test_group["id"]}
    )
    assert search_response.status_code == 200, f"게임 검색 실패: {search_response.text}"
    search_results = search_response.json()
    assert len(search_results) > 0, "검색 결과가 비어 있습니다."

    # 삭제 테스트: 생성된 게임 중 첫 번째 게임을 삭제(DELETE /games/{game_id})
    game_to_delete = games_created[0]
    delete_response = client.delete(
        f"/games/{game_to_delete['id']}", headers=admin_headers
    )
    assert delete_response.status_code == 204, f"게임 삭제 실패: {delete_response.text}"

    # 삭제 후 해당 게임 상세 조회 시 404 반환 검증 (GET /games/{game_id})
    detail_response = client.get(
        f"/games/{game_to_delete['id']}", headers=admin_headers
    )
    assert (
        detail_response.status_code == 404
    ), "삭제된 게임에 대한 상세 조회가 404를 반환하지 않습니다."


# 시나리오 1: 관리자가 새로운 설문을 생성하고 문항을 설정하는 경우
def test_admin_create_survey_with_questions(client, admin_headers, test_brand):
    # 1. 설문 생성 요청: POST /surveys
    survey_payload = {
        "title": "신규 설문조사",
        "description": "설문 조사 설명",
        "brand_id": test_brand["id"]
    }
    response = client.post("/surveys", json=survey_payload, headers=admin_headers)
    assert response.status_code in (200, 201), f"설문 생성 실패: {response.text}"
    survey_data = response.json()
    survey_id = survey_data.get("survey_id")
    assert survey_id is not None, "survey_id가 반환되지 않음."

    # 2. 설문 문항(질문) 생성 요청: POST /surveys/{survey_id}/questions
    questions_payload = {
        "questions": [
            {
                "text": "첫 번째 질문입니다.",
                "type": "multiple_choice",
                "options": ["옵션 A", "옵션 B", "옵션 C"]
            },
            {
                "text": "두 번째 질문입니다.",
                "type": "text"
            }
        ]
    }
    response = client.post(f"/surveys/{survey_id}/questions", json=questions_payload, headers=admin_headers)
    assert response.status_code in (200, 201), f"설문 문항 생성 실패: {response.text}"

    # 3. (선택 사항) 설문 제목 및 설명 수정 요청: PUT /surveys/{survey_id}
    update_payload = {
        "title": "수정된 설문 제목",
        "description": "수정된 설문 설명"
    }
    response = client.put(f"/surveys/{survey_id}", json=update_payload, headers=admin_headers)
    assert response.status_code == 200, f"설문 수정 실패: {response.text}"

    # 4. 전체 설문 양식 조회: GET /surveys/{survey_id} → 문항 포함 여부 확인
    response = client.get(f"/surveys/{survey_id}", headers=admin_headers)
    assert response.status_code == 200, f"설문 조회 실패: {response.text}"
    survey_detail = response.json()
    assert "questions" in survey_detail, "문항 정보가 응답에 포함되어 있지 않음."


    response = client.get(f"/landing/surveys?brand_id={test_brand['id']}")
    assert response.status_code == 200, f"설문 양식 조회 실패: {response.text}"
    survey_form = response.json()
    survey_id = survey_form.get("id")
    assert survey_id is not None, "설문 id가 누락됨."

    # 2. 소비자 응답 제출 요청: POST /surveys/responses  
    # 각 질문에 대한 응답 데이터를 함께 제공 (예시로 질문 id 1, 2 사용)
    response_payload = {
        "survey_id": survey_id,
        "response": {
            1: "옵션 A",
            2: "응답 텍스트"
        }
        
    }
    response = client.post("/landing/surveys/responses", json=response_payload)
    assert response.status_code in (200, 201), f"설문 응답 제출 실패: {response.text}"
    response_data = response.json()
    assert "id" in response_data, "응답 id가 반환되지 않음."


# 시나리오 3: 관리자가 제출된 설문 응답을 확인하고 상태를 변경하는 경우
def test_admin_update_survey_response_status(client, admin_headers, test_brand):
    # 테스트를 위해 우선 설문 및 응답을 생성합니다.
    # 1. 설문 생성 요청: POST /surveys
    survey_payload = {
        "title": "응답 확인 설문",
        "description": "상태 변경 테스트를 위한 설문",
        "brand_id": test_brand["id"]
    }
    response = client.post("/surveys", json=survey_payload, headers=admin_headers)
    assert response.status_code in (200, 201), f"설문 생성 실패: {response.text}"
    survey_data = response.json()
    survey_id = survey_data.get("survey_id")
    assert survey_id is not None, "설문 id 생성 실패"

    # 2. 설문 문항 생성 요청: POST /surveys/{survey_id}/questions
    questions_payload = {
        "questions": [
            {
                "text": "상태 변경 테스트 질문",
                "type": "text"
            }
        ]
    }
    response = client.post(f"/surveys/{survey_id}/questions", json=questions_payload, headers=admin_headers)
    assert response.status_code in (200, 201), f"문항 생성 실패: {response.text}"

    # 3. 응답 제출 요청: POST /surveys/responses
    response_payload = {
        "survey_id": survey_id,
        "response": {
            1: "테스트 응답"
        }
    }
    response = client.post("/landing/surveys/responses", json=response_payload)
    assert response.status_code in (200, 201), f"응답 제출 실패: {response.text}"
    response_data = response.json()
    response_id = response_data.get("id")
    assert response_id is not None, "응답 id 반환 실패"

    # 4. 제출된 응답 목록 조회: GET /surveys/responses?brand_id={brand_id}
    response = client.get(f"/surveys/responses?brand_id={test_brand['id']}", headers=admin_headers)
    assert response.status_code == 200, f"응답 목록 조회 실패: {response.text}"
    responses_list = response.json().get("responses")
    assert responses_list is not None, "응답 목록 데이터가 없음"
    # 생성한 응답이 목록에 포함되었는지 확인
    assert any(resp["id"] == response_id for resp in responses_list), "생성된 응답이 목록에 없음"

    # 5. 응답 상태 변경 요청: PUT /surveys/responses/{response_id}
    update_payload = {"regist_state": "ACCEPT"}
    response = client.put(f"/surveys/responses/{response_id}", json=update_payload, headers=admin_headers)
    assert response.status_code == 200, f"응답 상태 변경 실패: {response.text}"
    updated_response = response.json()
    assert updated_response.get("regist_state") == "ACCEPT", "응답 상태가 변경되지 않음"
