import { BirdCard } from "components/BirdCard";
import { BirdCardGrid } from "components/BirdCardGrid";
import { Button } from "components/Button";
import { Spinner } from "components/Spinner";
import { STATION_ID } from "constants/birdweather";
import { useFetchSpecies } from "hooks/useFetchSpecies";
import { useFetchStation } from "hooks/useFetchStation";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Fetch station data
  const {
    data: stationData,
    isLoading: isLoadingStation,
    error: stationError,
  } = useFetchStation();

  // Fetch species data
  const searchParams = useSearchParams();
  const station = searchParams.get("station") || STATION_ID;
  const locale = searchParams.get("locale") || "no";
  const period = searchParams.get("period") || "all";

  const {
    data: speciesData,
    isLoading: isLoadingSpecies,
    error: speciesError,
  } = useFetchSpecies({
    station,
    locale: locale,
    period: period,
  });

  // Sort by latest detection (active species)
  const speciesActive = [...speciesData].sort(
    (a, b) =>
      new Date(b.latestDetectionAt).getTime() -
      new Date(a.latestDetectionAt).getTime()
  );

  // Sort by total detections
  const speciesObservations = [...speciesData].sort(
    (a, b) => b.detections.total - a.detections.total
  );

  // Toggle different views
  const { sort = "active" } = router.query;
  const handleSortBy = (sortBy: string) => {
    router.push({ query: { ...router.query, sort: sortBy } });
  };

  return (
    <>
      <Head>
        <meta title="Fuglesang" />
        <meta
          name="description"
          content="Lyttestasjon for fugler i nærområdet"
        />
        <meta property="og:title" content="Fuglesang" />
        <meta
          property="og:description"
          content="Lyttestasjon for fugler i nærområdet"
        />
        <meta property="og:image" content="/bluetit.jpg" />
      </Head>

      <div className="wrap">
        <h1>Fuglesang</h1>

        {!isLoadingStation && (
          <div style={{ margin: "16px 0" }}>
            <p>{stationData?.detections || 0} observasjoner </p>
            <p>{stationData?.species || 0} ulike arter</p>
            {stationError && <p>{stationError.toString()}</p>}
          </div>
        )}

        <div style={{ margin: "16px 0 24px" }}>
          <Button
            onClick={() => handleSortBy("active")}
            isActive={sort === "active"}
          >
            Sist hørt
          </Button>
          <Button
            onClick={() => handleSortBy("observations")}
            isActive={sort === "observations"}
          >
            Flest besøk
          </Button>
        </div>

        {!isLoadingSpecies && (
          <div>
            <BirdCardGrid>
              {(sort === "observations"
                ? speciesObservations
                : speciesActive
              )?.map((species) => (
                <BirdCard data={species} key={species.id} />
              ))}
            </BirdCardGrid>

            {speciesError && <p>{speciesError.toString()}</p>}
          </div>
        )}

        {isLoadingStation && <Spinner />}
      </div>
    </>
  );
}
